
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

app.use(cors(corsConfig));
app.use(express.json());

const SERVER_TOKEN = initializeToken();

// Инициализация browser-use
const browserUseInstance = initBrowserUse();
if (browserUseInstance) {
  console.log("browser-use успешно инициализирован");
} else {
  console.error("Не удалось инициализировать browser-use");
}

// Регистрируем роуты
app.use('/health', healthRoutes);
app.use('/ports', portRoutes);
app.use('/ai', aiRoutes);
app.use('/linken-sphere', linkenSphereRoutes);
app.use('/workflow', workflowRoutes);
app.use('/browser-use', browserUseRoutes);
app.use('/files', filesRoutes);

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
    
    app.listen(port, '0.0.0.0', () => {
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
  } catch (error) {
    log.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
