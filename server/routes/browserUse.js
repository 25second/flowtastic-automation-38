
// browserUse.js - маршруты для интеграции с browser-use

import express from 'express';
import { executeScript, getBrowsers, createSession, closeSession } from '../controllers/browserUseController.js';

const router = express.Router();

// Маршрут для выполнения скрипта
router.post('/execute', executeScript);

// Маршрут для получения списка доступных браузеров
router.get('/browsers', getBrowsers);

// Маршрут для создания новой сессии браузера
router.post('/sessions', createSession);

// Маршрут для закрытия сессии браузера
router.delete('/sessions/:sessionId', closeSession);

export default router;
