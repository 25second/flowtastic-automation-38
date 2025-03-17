
import express from 'express';
import cors from 'cors';
import log from 'electron-log';
import corsConfig from './config/cors.js';
import { initializeToken } from './controllers/registrationController.js';
import tcpPortUsed from 'tcp-port-used';

// Импортируем роуты
import healthRoutes from './routes/health.js';
import portRoutes from './routes/ports.js';
import aiRoutes from './routes/ai.js';
import linkenSphereRoutes from './routes/linkenSphere.js';
import workflowRoutes from './routes/workflow.js';
import browserUseRoutes from './routes/browserUse.js';
import filesRoutes from './routes/files.js';
import { initBrowserUse } from './controllers/browserUseController.js';

const app = express();

// Увеличиваем лимиты для JSON парсинга
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsConfig));

const SERVER_TOKEN = initializeToken();

// Инициализация browser-use
const browserUseInstance = initBrowserUse();
if (browserUseInstance) {
  console.log("browser-use успешно инициализирован");
} else {
  console.error("Не удалось инициализировать browser-use");
}

// Увеличиваем таймаут для запросов
app.use((req, res, next) => {
  res.setTimeout(120000); // 2 минуты
  next();
});

// Регистрируем роуты
app.use('/health', healthRoutes);
app.use('/ports', portRoutes);
app.use('/ai', aiRoutes);
app.use('/linken-sphere', linkenSphereRoutes);
app.use('/workflow', workflowRoutes);
app.use('/browser-use', browserUseRoutes);
app.use('/files', filesRoutes);

// Добавляем обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  log.error('Server error:', err);
  res.status(500).json({ 
    error: true, 
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const findAvailablePort = async (startPort, maxTries = 10) => {
  for (let port = startPort; port < startPort + maxTries; port++) {
    try {
      const inUse = await tcpPortUsed.check(port, '0.0.0.0');
      if (!inUse) {
        return port;
      }
    } catch (err) {
      log.error(`Error checking port ${port}:`, err);
    }
  }
  throw new Error(`No available ports found between ${startPort} and ${startPort + maxTries - 1}`);
};

const startServer = async () => {
  try {
    const defaultPort = process.env.PORT || 3001;
    const port = await findAvailablePort(Number(defaultPort));
    
    const server = app.listen(port, '0.0.0.0', () => {
      log.info(`Server running on port ${port}`);
      log.info(`Server URL: http://localhost:${port}`);
      log.info('Available endpoints:');
      log.info('- GET /health');
      log.info('- GET /ports/check');
      log.info('- POST /ai/generate');
      log.info('- GET /linken-sphere/sessions');
      log.info('- POST /linken-sphere/sessions/start');
      log.info('- POST /linken-sphere/sessions/stop');
      log.info('- GET /workflow/browsers');
      log.info('- POST /workflow/register');
      log.info('- POST /workflow/execute');
      log.info('- POST /workflow/start-recording');
      log.info('- POST /workflow/stop-recording');
      log.info('- GET /files/list');
      log.info('- POST /files/upload');
      log.info('- GET /files/download/:filePath');
      log.info('- DELETE /files/delete/:filePath');
      log.info('- POST /files/create-directory');
      log.info('- POST /files/rename');
      log.info('- POST /files/move');
      log.info('- POST /files/copy');
    });
    
    // Устанавливаем таймауты для сервера
    server.timeout = 120000; // 2 минуты
    server.keepAliveTimeout = 65000; // 65 секунд
    server.headersTimeout = 66000; // 66 секунд
  } catch (error) {
    log.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error);
  console.error('Uncaught Exception:', error);
});

// Обработка необработанных отклонений промисов
process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled Rejection at:', promise, 'reason:', reason);
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
