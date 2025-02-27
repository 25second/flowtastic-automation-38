
// browserUseController.js
// Контроллер для управления интеграцией с browser-use

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import path from 'path';
import { fileURLToPath } from 'url';

// Определяем __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Импортируем browser-use
let browserUse;
try {
  // В зависимости от того, как установлен пакет, путь может отличаться
  // Сначала пробуем прямой импорт
  browserUse = require('browser-use');
} catch (e) {
  console.error("Ошибка при импорте browser-use:", e);
  try {
    // Затем пробуем путь к node_modules
    browserUse = require(path.join(__dirname, '../../node_modules/browser-use'));
  } catch (e2) {
    console.error("Вторая попытка импорта browser-use не удалась:", e2);
    browserUse = null;
  }
}

// Функция инициализации browser-use
export const initBrowserUse = () => {
  if (!browserUse) {
    console.error("browser-use не был корректно импортирован");
    return null;
  }
  
  try {
    console.log("Инициализация browser-use...");
    // Здесь можно добавить код инициализации browser-use, если требуется
    return browserUse;
  } catch (error) {
    console.error("Ошибка при инициализации browser-use:", error);
    return null;
  }
};

// Выполнение скрипта с использованием browser-use
export const executeScript = async (req, res) => {
  try {
    const { script, options } = req.body;
    
    if (!script) {
      return res.status(400).json({ success: false, message: 'Скрипт не указан' });
    }
    
    if (!browserUse) {
      return res.status(500).json({ success: false, message: 'browser-use не инициализирован' });
    }
    
    console.log("Выполнение скрипта с browser-use...");
    
    // Здесь должен быть код для выполнения скрипта с использованием browser-use
    // Это примерный код, который нужно будет адаптировать под API browser-use
    const result = await browserUse.execute(script, options);
    
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("Ошибка при выполнении скрипта:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Получение списка доступных браузеров
export const getBrowsers = async (req, res) => {
  try {
    if (!browserUse) {
      return res.status(500).json({ success: false, message: 'browser-use не инициализирован' });
    }
    
    // Пример получения списка браузеров из browser-use
    // Адаптируйте под реальное API browser-use
    const browsers = await browserUse.getBrowsers();
    
    return res.status(200).json({ success: true, browsers });
  } catch (error) {
    console.error("Ошибка при получении списка браузеров:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  initBrowserUse,
  executeScript,
  getBrowsers
};
