
// browserUse.js - маршруты для интеграции с browser-use

import express from 'express';
import { executeScript, getBrowsers } from '../controllers/browserUseController.js';

const router = express.Router();

// Маршрут для выполнения скрипта
router.post('/execute', executeScript);

// Маршрут для получения списка доступных браузеров
router.get('/browsers', getBrowsers);

export default router;
