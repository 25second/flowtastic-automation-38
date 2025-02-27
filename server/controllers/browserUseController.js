
// browserUseController.js
// Контроллер для управления интеграцией с browser-use

import browserUse from '../browser-use/index.js';

// Функция инициализации browser-use
export const initBrowserUse = () => {
  try {
    console.log("Инициализация browser-use...");
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
    
    console.log("Выполнение скрипта с browser-use...");
    
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
    console.log("Получение списка браузеров...");
    
    const browsers = await browserUse.getBrowsers();
    
    return res.status(200).json({ success: true, browsers });
  } catch (error) {
    console.error("Ошибка при получении списка браузеров:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Создание новой сессии браузера
export const createSession = async (req, res) => {
  try {
    const { browserType, options } = req.body;
    
    if (!browserType) {
      return res.status(400).json({ success: false, message: 'Не указан тип браузера' });
    }
    
    const result = await browserUse.createSession(browserType, options);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error("Ошибка при создании сессии браузера:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Закрытие сессии браузера
export const closeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Не указан ID сессии' });
    }
    
    const result = await browserUse.closeSession(sessionId);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error("Ошибка при закрытии сессии браузера:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  initBrowserUse,
  executeScript,
  getBrowsers,
  createSession,
  closeSession
};
