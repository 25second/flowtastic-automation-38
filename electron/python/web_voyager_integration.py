
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Web Voyager интеграция для browser-use
Расширяет функционал browser-use для работы с WebVoyager агентами
"""

import json
import logging
import asyncio
from typing import Dict, Any, List, Optional, Union
from datetime import datetime

try:
    import browser_use
    from browser_use_extensions import BrowserUseExtensions
    BROWSER_USE_AVAILABLE = True
except ImportError:
    BROWSER_USE_AVAILABLE = False
    print("Warning: browser-use library not found, some features will be disabled")

# Настраиваем логирование
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("web_voyager")

class WebVoyagerBrowserAgent:
    """Класс интеграции Web Voyager с browser-use"""
    
    def __init__(self, browser, task_description: str, debug: bool = False):
        """
        Инициализация агента
        
        Args:
            browser: Экземпляр browser-use
            task_description: Описание задачи
            debug: Включить режим отладки
        """
        self.browser = browser
        self.task_description = task_description
        self.debug = debug
        
        # Инициализируем расширения browser-use
        self.extensions = BrowserUseExtensions(browser)
        
        # История действий
        self.action_history = []
        
        # Текущее состояние
        self.current_subtask = None
        self.subtasks = []
        
        logger.info(f"WebVoyagerBrowserAgent initialized with task: {task_description}")
    
    async def create_task_plan(self) -> Dict[str, Any]:
        """
        Создает план выполнения задачи с помощью API OpenAI
        
        Returns:
            Dict: План задачи с подзадачами
        """
        logger.info("Creating task plan...")
        
        # В реальном приложении здесь будет вызов API OpenAI
        # для создания плана, пока используем упрощенный пример
        
        # Пример плана
        sample_plan = {
            "task": self.task_description,
            "subtasks": [
                {
                    "id": 1,
                    "description": f"Navigate to the website related to {self.task_description}",
                    "estimated_browser_actions": 1
                },
                {
                    "id": 2,
                    "description": "Find and fill out registration form",
                    "estimated_browser_actions": 3
                },
                {
                    "id": 3,
                    "description": "Submit form and handle confirmation",
                    "estimated_browser_actions": 2
                },
                {
                    "id": 4,
                    "description": "Extract confirmation details or account info",
                    "estimated_browser_actions": 1
                }
            ],
            "reasoning": f"To complete the task '{self.task_description}', we need to navigate to the relevant website, find and fill out forms, submit them, and extract any confirmation details."
        }
        
        self.subtasks = sample_plan["subtasks"]
        logger.info(f"Created plan with {len(self.subtasks)} subtasks")
        
        return sample_plan
    
    async def determine_next_action(self, subtask_description: str, page_content: Dict[str, Any]) -> Dict[str, Any]:
        """
        Определяет следующее действие для выполнения
        
        Args:
            subtask_description: Описание текущей подзадачи
            page_content: Содержимое страницы
            
        Returns:
            Dict: Действие для выполнения
        """
        logger.info(f"Determining next action for: {subtask_description}")
        
        # В реальном приложении это будет вызов API OpenAI
        # Пример действия
        
        # Упрощенная логика для демонстрации
        if "Navigate" in subtask_description:
            if "outlook" in self.task_description.lower():
                return {
                    "action": "navigate",
                    "url": "https://signup.live.com/",
                    "reason": "Navigating to Outlook signup page"
                }
            else:
                return {
                    "action": "navigate",
                    "url": "https://example.com/",
                    "reason": "Navigating to example page"
                }
        elif "form" in subtask_description.lower():
            if "Find" in subtask_description:
                return {
                    "action": "click",
                    "selector": "input[name='email']",
                    "reason": "Clicking on email input field"
                }
            else:
                return {
                    "action": "type",
                    "selector": "input[name='email']",
                    "value": "test_user_" + datetime.now().strftime("%Y%m%d%H%M%S") + "@example.com",
                    "reason": "Typing email in the form"
                }
        elif "Submit" in subtask_description:
            return {
                "action": "click",
                "selector": "button[type='submit']",
                "reason": "Submitting the form"
            }
        elif "Extract" in subtask_description:
            return {
                "action": "extract",
                "selector": ".confirmation-message",
                "reason": "Extracting confirmation message"
            }
        else:
            return {
                "action": "wait",
                "selector": "body",
                "reason": "Waiting for page to load fully"
            }
    
    async def execute_action(self, action: Dict[str, Any]) -> str:
        """
        Выполняет действие в браузере
        
        Args:
            action: Действие для выполнения
            
        Returns:
            str: Результат выполнения
        """
        logger.info(f"Executing action: {action['action']}")
        
        result = ""
        page = self.browser.page
        
        try:
            if action["action"] == "click":
                selector = action.get("selector")
                if not selector:
                    raise ValueError("Selector is required for click action")
                    
                await page.click(selector)
                result = f"Clicked on {selector}"
                
            elif action["action"] == "type":
                selector = action.get("selector")
                value = action.get("value")
                if not selector or not value:
                    raise ValueError("Selector and value are required for type action")
                    
                await page.fill(selector, value)
                result = f"Typed '{value}' into {selector}"
                
            elif action["action"] == "navigate":
                url = action.get("url")
                if not url:
                    raise ValueError("URL is required for navigate action")
                    
                await page.goto(url)
                result = f"Navigated to {url}"
                
            elif action["action"] == "extract":
                selector = action.get("selector")
                if not selector:
                    raise ValueError("Selector is required for extract action")
                    
                text = await page.inner_text(selector)
                result = f"Extracted: {text}"
                
            elif action["action"] == "wait":
                selector = action.get("selector")
                if not selector:
                    raise ValueError("Selector is required for wait action")
                    
                await page.wait_for_selector(selector)
                result = f"Waited for {selector}"
                
            elif action["action"] == "submit":
                selector = action.get("selector")
                if not selector:
                    raise ValueError("Selector is required for submit action")
                    
                await page.click(selector)
                await page.wait_for_load_state("networkidle")
                result = f"Submitted form using {selector}"
                
            else:
                raise ValueError(f"Unknown action: {action['action']}")
                
        except Exception as e:
            logger.error(f"Error executing {action['action']}: {str(e)}")
            result = f"Error: {str(e)}"
            
        # Добавляем действие в историю
        self.action_history.append({
            "action": action,
            "result": result,
            "timestamp": datetime.now().isoformat()
        })
        
        return result
    
    async def get_page_content(self) -> Dict[str, Any]:
        """
        Получает структурированное содержимое страницы
        
        Returns:
            Dict: Структурированное содержимое страницы
        """
        page = self.browser.page
        
        try:
            # Получаем базовую информацию о странице
            url = page.url
            title = await page.title()
            
            # Получаем текст страницы
            body_text = await page.inner_text("body")
            
            # Получаем информацию о ссылках
            links_data = await page.evaluate("""
                Array.from(document.querySelectorAll('a')).map(a => ({
                    text: a.innerText.trim(),
                    href: a.href,
                    id: a.id,
                    class: a.className
                }))
            """)
            
            # Получаем информацию о полях ввода
            inputs_data = await page.evaluate("""
                Array.from(document.querySelectorAll('input, textarea, select')).map(input => ({
                    type: input.type || input.tagName.toLowerCase(),
                    name: input.name,
                    id: input.id,
                    placeholder: input.placeholder,
                    value: input.value,
                    class: input.className
                }))
            """)
            
            # Получаем информацию о кнопках
            buttons_data = await page.evaluate("""
                Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]')).map(btn => ({
                    text: btn.innerText.trim() || btn.value,
                    id: btn.id,
                    class: btn.className,
                    type: btn.type
                }))
            """)
            
            # Составляем структурированное представление страницы
            return {
                "title": title,
                "url": url,
                "bodyText": body_text[:1000],  # Берем только первые 1000 символов
                "links": links_data[:20],  # Берем только первые 20 ссылок
                "inputs": inputs_data,
                "buttons": buttons_data
            }
            
        except Exception as e:
            logger.error(f"Error getting page content: {str(e)}")
            return {
                "title": "Error",
                "url": "Error",
                "bodyText": f"Error getting page content: {str(e)}",
                "links": [],
                "inputs": [],
                "buttons": []
            }
    
    async def execute_task(self) -> Dict[str, Any]:
        """
        Выполняет задачу целиком
        
        Returns:
            Dict: Результат выполнения задачи
        """
        results = {
            "success": False,
            "message": "",
            "data": {},
            "history": []
        }
        
        try:
            # Создаем план выполнения задачи
            plan = await self.create_task_plan()
            logger.info(f"Created plan: {json.dumps(plan, indent=2)}")
            
            # Выполняем каждую подзадачу
            for subtask in self.subtasks:
                logger.info(f"Executing subtask {subtask['id']}: {subtask['description']}")
                self.current_subtask = subtask
                
                # Примерное количество действий для подзадачи
                actions_executed = 0
                max_actions = max(subtask.get("estimated_browser_actions", 5), 5)
                subtask_results = []
                
                # Выполняем действия для подзадачи
                while actions_executed < max_actions:
                    # Получаем текущее содержимое страницы
                    page_content = await self.get_page_content()
                    
                    # Определяем следующее действие
                    next_action = await self.determine_next_action(
                        subtask["description"], 
                        page_content
                    )
                    
                    # Выполняем действие
                    logger.info(f"Executing action: {next_action}")
                    action_result = await self.execute_action(next_action)
                    logger.info(f"Action result: {action_result}")
                    
                    # Сохраняем результаты
                    subtask_results.append({
                        "action": next_action,
                        "result": action_result
                    })
                    
                    # Увеличиваем счетчик действий
                    actions_executed += 1
                    
                    # Если это действие извлечения данных, завершаем подзадачу
                    if next_action["action"] == "extract":
                        break
                    
                    # Небольшая пауза между действиями
                    await asyncio.sleep(1)
                
                # Сохраняем результаты подзадачи
                results["data"][f"subtask_{subtask['id']}"] = {
                    "description": subtask["description"],
                    "actions_executed": actions_executed,
                    "results": subtask_results
                }
                
                logger.info(f"Completed subtask {subtask['id']} after {actions_executed} actions")
            
            # Все подзадачи выполнены
            results["success"] = True
            results["message"] = f"Successfully completed task: {self.task_description}"
            results["history"] = self.action_history
            
        except Exception as e:
            logger.error(f"Error executing task: {str(e)}")
            results["success"] = False
            results["message"] = f"Failed to complete task: {str(e)}"
            results["history"] = self.action_history
        
        return results

# Функция для запуска агента через browser-use
async def run_web_voyager_agent(browser, task_description, debug=False):
    """
    Запускает Web Voyager агент
    
    Args:
        browser: Экземпляр browser-use
        task_description: Описание задачи
        debug: Включить режим отладки
        
    Returns:
        Dict: Результаты выполнения задачи
    """
    agent = WebVoyagerBrowserAgent(browser, task_description, debug)
    results = await agent.execute_task()
    return results

# Функция для использования из Python
def execute_web_voyager_task(task, port=9222, debug=False):
    """
    Выполняет задачу Web Voyager из Python
    
    Args:
        task: Описание задачи
        port: Порт для подключения к Chrome
        debug: Включить режим отладки
        
    Returns:
        Dict: Результаты выполнения задачи
    """
    if not BROWSER_USE_AVAILABLE:
        return {
            "success": False,
            "message": "browser-use library not available",
            "timestamp": datetime.now().isoformat()
        }
    
    try:
        # Подключаемся к Chrome
        if debug:
            browser_use.set_debug(True)
            
        browser = browser_use.connect(port)
        page = browser.new_page()
        
        # Запускаем агент
        results = asyncio.run(run_web_voyager_agent(browser, task, debug))
        
        # Закрываем браузер
        browser.close()
        
        return results
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            "success": False,
            "message": f"Error: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    # Пример использования
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python web_voyager_integration.py 'task description' [debug]")
        sys.exit(1)
    
    task = sys.argv[1]
    debug = len(sys.argv) > 2 and sys.argv[2].lower() == 'debug'
    
    results = execute_web_voyager_task(task, debug=debug)
    print(json.dumps(results, indent=2))
