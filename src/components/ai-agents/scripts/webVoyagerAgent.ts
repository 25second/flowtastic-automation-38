import { OpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';
import * as cheerio from 'cheerio';

/**
 * WebVoyagerAgent - ИИ агент для автоматизации браузера на основе концепций Web Voyager
 * Использует LLM для планирования и выполнения задач в браузере
 */

// Схема для валидации действий браузера
const browserActionSchema = z.object({
  action: z.enum(['click', 'type', 'navigate', 'extract', 'wait', 'submit']),
  selector: z.string().optional(),
  value: z.string().optional(),
  url: z.string().optional(),
  reason: z.string(),
});

// Схема для плана выполнения задачи
const taskPlanSchema = z.object({
  task: z.string(),
  subtasks: z.array(z.object({
    id: z.number(),
    description: z.string(),
    estimated_browser_actions: z.number(),
  })),
  reasoning: z.string(),
});

// Схема для результата выполнения задачи
const taskResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.record(z.any()).optional(),
});

// Определяем типы для экспорта
export type BrowserAction = z.infer<typeof browserActionSchema>;
export type TaskPlan = z.infer<typeof taskPlanSchema>;
export type TaskResult = z.infer<typeof taskResultSchema>;

/**
 * Класс для планирования подзадач на основе основной задачи
 */
export class TaskPlanner {
  private model: OpenAI;
  private systemPrompt: string;

  constructor(apiKey: string, modelName: string) {
    this.model = new OpenAI({
      apiKey,
      modelName,
      temperature: 0.2,
    });

    this.systemPrompt = `
      You are an AI task planner specialized in breaking down complex web automation tasks into specific subtasks.
      For each task, analyze what would be required and create a detailed plan of subtasks.
      Each subtask should be specific and actionable within a browser environment.
      Consider typical web interactions, form filling, navigation, and data extraction.
    `;
  }

  /**
   * Создает план выполнения задачи
   * @param task высокоуровневая задача
   * @returns план подзадач
   */
  async createPlan(task: string): Promise<z.infer<typeof taskPlanSchema>> {
    const prompt = ChatPromptTemplate.fromMessages([
      new SystemMessage(this.systemPrompt),
      new HumanMessage(`Create a detailed plan to accomplish this task: "${task}". 
        Break it down into specific subtasks that can be executed in a browser.
        For each subtask, estimate how many browser actions it might require.
        Format your response as JSON with fields: task, subtasks (array of objects with id, description, and estimated_browser_actions), and reasoning.`)
    ]);

    const outputParser = new JsonOutputParser<z.infer<typeof taskPlanSchema>>();
    
    try {
      const chain = prompt.pipe(this.model).pipe(outputParser);
      const result = await chain.invoke({});
      return taskPlanSchema.parse(result);
    } catch (error) {
      console.error("Error creating task plan:", error);
      throw new Error(`Failed to create task plan: ${error.message}`);
    }
  }
}

/**
 * Класс для выполнения действий в браузере
 */
export class BrowserAgent {
  private model: OpenAI;
  private systemPrompt: string;
  private page: any; // Playwright Page
  private actionHistory: Array<{action: string, result: string}> = [];

  constructor(apiKey: string, modelName: string, page: any) {
    this.model = new OpenAI({
      apiKey,
      modelName,
      temperature: 0.1,
    });
    this.page = page;

    this.systemPrompt = `
      You are an AI browser automation agent that helps control a web browser.
      Your task is to determine the next best action to take in a browser to accomplish a specific subtask.
      You should analyze the current page content and determine the most appropriate action.
      Available actions: 
      - click: Click on an element (requires selector)
      - type: Type text into an input field (requires selector and value)
      - navigate: Navigate to a URL (requires url)
      - extract: Extract data from the page (requires selector)
      - wait: Wait for a specific condition (requires selector)
      - submit: Submit a form (requires selector)
    `;
  }

  /**
   * Определяет следующее действие для выполнения подзадачи
   * @param subtask описание подзадачи
   * @param pageContent текущее содержимое страницы
   * @returns действие для выполнения
   */
  async determineNextAction(subtask: string, pageContent: string): Promise<z.infer<typeof browserActionSchema>> {
    const historyContext = this.actionHistory.length > 0 
      ? `Previous actions: ${JSON.stringify(this.actionHistory.slice(-5))}\n` 
      : '';
    
    const prompt = ChatPromptTemplate.fromMessages([
      new SystemMessage(this.systemPrompt),
      new HumanMessage(`${historyContext}
        Current subtask: "${subtask}"
        
        Current page content:
        ${pageContent.substring(0, 7000)}
        
        Analyze the page and determine the next action to take to accomplish the subtask.
        Return only a JSON object with the following structure:
        {
          "action": "click" | "type" | "navigate" | "extract" | "wait" | "submit",
          "selector": "CSS selector or XPath" (if applicable),
          "value": "text to type" (if applicable),
          "url": "URL to navigate to" (if applicable),
          "reason": "brief explanation why this action is necessary"
        }`)
    ]);

    const outputParser = new JsonOutputParser<z.infer<typeof browserActionSchema>>();
    
    try {
      const chain = prompt.pipe(this.model).pipe(outputParser);
      const result = await chain.invoke({});
      return browserActionSchema.parse(result);
    } catch (error) {
      console.error("Error determining next browser action:", error);
      throw new Error(`Failed to determine next action: ${error.message}`);
    }
  }

  /**
   * Получает текущее содержимое страницы
   * @returns HTML контент и структурированные данные
   */
  async getPageContent(): Promise<string> {
    try {
      const html = await this.page.content();
      const $ = cheerio.load(html);
      
      // Удаляем скрипты и стили для уменьшения размера
      $('script').remove();
      $('style').remove();
      
      // Получаем текст и основные интерактивные элементы
      const bodyText = $('body').text().trim().replace(/\s+/g, ' ');
      
      // Собираем информацию о ключевых элементах
      const links = $('a').map((i, el) => {
        const $el = $(el);
        return {
          text: $el.text().trim(),
          href: $el.attr('href'),
          id: $el.attr('id'),
          class: $el.attr('class')
        };
      }).get();
      
      const inputs = $('input, textarea, select').map((i, el) => {
        const $el = $(el);
        return {
          type: $el.attr('type') || $el.prop('tagName').toLowerCase(),
          name: $el.attr('name'),
          id: $el.attr('id'),
          placeholder: $el.attr('placeholder'),
          value: $el.val(),
          class: $el.attr('class')
        };
      }).get();
      
      const buttons = $('button, input[type="submit"], input[type="button"]').map((i, el) => {
        const $el = $(el);
        return {
          text: $el.text().trim() || $el.attr('value'),
          id: $el.attr('id'),
          class: $el.attr('class'),
          type: $el.attr('type')
        };
      }).get();

      // Составляем структурированное представление страницы
      const structuredContent = {
        title: $('title').text(),
        url: await this.page.url(),
        bodyText: bodyText.substring(0, 1000),
        links: links.slice(0, 20),
        inputs: inputs.slice(0, 20),
        buttons: buttons.slice(0, 20)
      };
      
      return JSON.stringify(structuredContent);
    } catch (error) {
      console.error("Error getting page content:", error);
      return "Error extracting page content";
    }
  }

  /**
   * Выполняет действие в браузере
   * @param action действие для выполнения
   * @returns результат выполнения
   */
  async executeAction(action: z.infer<typeof browserActionSchema>): Promise<string> {
    try {
      let result = "";
      
      switch (action.action) {
        case 'click':
          if (!action.selector) throw new Error("Selector is required for click action");
          await this.page.click(action.selector);
          result = `Clicked on ${action.selector}`;
          break;
          
        case 'type':
          if (!action.selector) throw new Error("Selector is required for type action");
          if (!action.value) throw new Error("Value is required for type action");
          await this.page.fill(action.selector, action.value);
          result = `Typed "${action.value}" into ${action.selector}`;
          break;
          
        case 'navigate':
          if (!action.url) throw new Error("URL is required for navigate action");
          await this.page.goto(action.url);
          result = `Navigated to ${action.url}`;
          break;
          
        case 'extract':
          if (!action.selector) throw new Error("Selector is required for extract action");
          const extractedText = await this.page.textContent(action.selector);
          result = `Extracted: ${extractedText}`;
          break;
          
        case 'wait':
          if (!action.selector) throw new Error("Selector is required for wait action");
          await this.page.waitForSelector(action.selector);
          result = `Waited for ${action.selector}`;
          break;
          
        case 'submit':
          if (!action.selector) throw new Error("Selector is required for submit action");
          await this.page.click(action.selector);
          await this.page.waitForLoadState('networkidle');
          result = `Submitted form using ${action.selector}`;
          break;
      }
      
      // Добавляем действие в историю
      this.actionHistory.push({
        action: JSON.stringify(action),
        result
      });
      
      return result;
    } catch (error) {
      console.error(`Error executing browser action ${action.action}:`, error);
      this.actionHistory.push({
        action: JSON.stringify(action),
        result: `Error: ${error.message}`
      });
      throw error;
    }
  }
}

/**
 * Класс для взаимодействия с таблицами
 */
export class TableInteraction {
  /**
   * Сохраняет данные в таблицу
   * @param tableId ID таблицы
   * @param data данные для сохранения
   */
  async saveToTable(tableId: string, data: any): Promise<boolean> {
    try {
      const response = await fetch('/api/table-api/write-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId,
          data
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save data to table: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error("Error saving data to table:", error);
      return false;
    }
  }

  /**
   * Читает данные из таблицы
   * @param tableId ID таблицы
   * @returns данные из таблицы
   */
  async readFromTable(tableId: string): Promise<any> {
    try {
      const response = await fetch('/api/table-api/get-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to read data from table: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error reading data from table:", error);
      throw error;
    }
  }
}

/**
 * Главный класс AgentController для управления всем процессом
 */
export class AgentController {
  private taskPlanner: TaskPlanner;
  private browserAgent: BrowserAgent;
  private tableInteraction: TableInteraction;
  private page: any; // Playwright Page
  
  constructor(apiKey: string, modelName: string, page: any) {
    this.taskPlanner = new TaskPlanner(apiKey, modelName);
    this.browserAgent = new BrowserAgent(apiKey, modelName, page);
    this.tableInteraction = new TableInteraction();
    this.page = page;
  }

  /**
   * Запускает выполнение задачи
   * @param task высокоуровневая задача
   * @param tableId ID таблицы для сохранения результатов
   * @returns результат выполнения
   */
  async executeTask(task: string, tableId?: string): Promise<z.infer<typeof taskResultSchema>> {
    try {
      console.log(`Starting execution of task: ${task}`);
      
      // Создаем план выполнения задачи
      const plan = await this.taskPlanner.createPlan(task);
      console.log("Task plan created:", plan);
      
      // Результаты выполнения
      const results: Record<string, any> = {};
      
      // Выполняем каждую подзадачу
      for (const subtask of plan.subtasks) {
        console.log(`Executing subtask ${subtask.id}: ${subtask.description}`);
        
        // Примерное количество действий для подзадачи
        let actionsExecuted = 0;
        const maxActions = Math.max(subtask.estimated_browser_actions, 5);
        
        // Выполняем действия для подзадачи
        while (actionsExecuted < maxActions) {
          // Получаем текущее содержимое страницы
          const pageContent = await this.browserAgent.getPageContent();
          
          // Определяем следующее действие
          const nextAction = await this.browserAgent.determineNextAction(
            subtask.description, 
            pageContent
          );
          
          // Выполняем действие
          console.log(`Executing action:`, nextAction);
          const actionResult = await this.browserAgent.executeAction(nextAction);
          console.log(`Action result: ${actionResult}`);
          
          // Увеличиваем счетчик действий
          actionsExecuted++;
          
          // Проверяем, завершена ли подзадача
          if (nextAction.action === 'extract') {
            results[`subtask_${subtask.id}`] = actionResult;
            break;
          }
          
          // Небольшая пауза между действиями
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`Completed subtask ${subtask.id} after ${actionsExecuted} actions`);
      }
      
      // Сохраняем результаты в таблицу, если указан ID таблицы
      if (tableId) {
        await this.tableInteraction.saveToTable(tableId, results);
      }
      
      return {
        success: true,
        message: `Successfully completed task: ${task}`,
        data: results
      };
    } catch (error) {
      console.error("Error executing task:", error);
      return {
        success: false,
        message: `Failed to complete task: ${error.message}`
      };
    }
  }
}
