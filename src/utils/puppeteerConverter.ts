
import { FlowNodeWithData } from '@/types/flow';

// Функция для генерации уникальных ID
const generateId = () => crypto.randomUUID();

// Функция для создания базовой ноды
const createBaseNode = (type: string, label: string, x: number, y: number, settings: Record<string, any> = {}): FlowNodeWithData => ({
  id: generateId(),
  type,
  position: { x, y },
  data: {
    label,
    settings
  }
});

// Парсинг Puppeteer команд в ноды
export const convertPuppeteerToNodes = (scriptContent: string): FlowNodeWithData[] => {
  const nodes: FlowNodeWithData[] = [];
  let y = 100;
  
  // Добавляем стартовую ноду
  nodes.push(createBaseNode('start', 'Start', 250, 25));

  // Разбиваем скрипт на строки и анализируем каждую команду
  const lines = scriptContent.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('//'));

  for (const line of lines) {
    if (line.includes('goto')) {
      // Обработка открытия страницы
      const url = line.match(/['"`](.*?)['"`]/)?.[1] || '';
      nodes.push(createBaseNode('open-page', 'Open Page', 250, y, { url }));
    } 
    else if (line.includes('.click(')) {
      // Обработка кликов
      const selector = line.match(/['"`](.*?)['"`]/)?.[1] || '';
      nodes.push(createBaseNode('click', 'Click Element', 250, y, { 
        selector,
        clickType: 'single'
      }));
    }
    else if (line.includes('.type(')) {
      // Обработка ввода текста
      const matches = line.match(/['"](.*?)['"],\s*['"`](.*?)['"`]/);
      if (matches) {
        nodes.push(createBaseNode('input-text', 'Type Text', 250, y, {
          selector: matches[1],
          text: matches[2]
        }));
      }
    }
    else if (line.includes('.select(')) {
      // Обработка выбора из выпадающего списка
      const matches = line.match(/['"](.*?)['"],\s*['"`](.*?)['"`]/);
      if (matches) {
        nodes.push(createBaseNode('page-select', 'Select Option', 250, y, {
          selector: matches[1],
          value: matches[2]
        }));
      }
    }
    else if (line.includes('waitForSelector')) {
      // Обработка ожидания элемента
      const selector = line.match(/['"`](.*?)['"`]/)?.[1] || '';
      nodes.push(createBaseNode('wait', 'Wait for Element', 250, y, {
        selector,
        mode: 'element'
      }));
    }
    else if (line.includes('evaluate')) {
      // Обработка выполнения JavaScript
      const codeMatch = line.match(/\{([\s\S]*?)\}/);
      if (codeMatch) {
        nodes.push(createBaseNode('run-script', 'Run JavaScript', 250, y, {
          code: codeMatch[1].trim()
        }));
      }
    }
    
    y += 100; // Увеличиваем отступ для следующей ноды
  }

  return nodes;
};
