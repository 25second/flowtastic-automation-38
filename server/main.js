
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import './server.js';
import electronLog from 'electron-log';

// Настройка логирования
electronLog.initialize({ preload: true });
electronLog.transports.file.level = 'info';

// Определяем __dirname для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Переменные состояния приложения
let mainWindow;
let serverToken = generateToken();
let connections = [];
let tasks = [];
let files = [];
let logs = [];

// Путь к директории для хранения файлов
const storageDir = path.join(app.getPath('userData'), 'storage');
// Путь к файлу конфигурации
const configPath = path.join(app.getPath('userData'), 'config.json');

// Создание директории для хранения, если не существует
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Загрузка конфигурации при старте
function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.serverToken) serverToken = config.serverToken;
      logMessage('Конфигурация загружена');
    } else {
      saveConfig();
      logMessage('Создана новая конфигурация');
    }
  } catch (error) {
    logMessage(`Ошибка загрузки конфигурации: ${error.message}`, 'error');
  }
}

// Сохранение конфигурации
function saveConfig() {
  try {
    const config = {
      serverToken,
      lastSaved: new Date().toISOString()
    };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    logMessage(`Ошибка сохранения конфигурации: ${error.message}`, 'error');
  }
}

// Функция для генерации токена
function generateToken() {
  return uuidv4();
}

// Функция для добавления лога
function logMessage(message, level = 'info') {
  const time = new Date().toISOString().split('T')[1].split('.')[0];
  const logEntry = { time, content: message, level };
  logs.push(logEntry);
  
  // Ограничиваем количество логов
  if (logs.length > 1000) {
    logs = logs.slice(-1000);
  }
  
  // Отправляем новый лог в окно
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('new-log', logEntry);
  }
  
  // Записываем в файл логов
  if (level === 'error') {
    electronLog.error(message);
  } else {
    electronLog.info(message);
  }
}

// Функция для создания окна приложения
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, '../build/icon.ico')
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  logMessage('Окно приложения создано');
}

// Инициализация приложения
app.whenReady().then(() => {
  loadConfig();
  createWindow();
  
  // Загрузка списка файлов при старте
  loadStoredFiles();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Загрузка файлов из хранилища
function loadStoredFiles() {
  try {
    fs.readdir(storageDir, (err, fileList) => {
      if (err) {
        logMessage(`Ошибка чтения директории: ${err.message}`, 'error');
        return;
      }
      
      files = fileList.map(fileName => {
        const filePath = path.join(storageDir, fileName);
        const stats = fs.statSync(filePath);
        return {
          id: fileName.split('.')[0],
          name: fileName,
          path: filePath,
          size: stats.size,
          createdAt: stats.birthtime
        };
      });
      
      logMessage(`Загружено ${files.length} файлов из хранилища`);
    });
  } catch (error) {
    logMessage(`Ошибка загрузки файлов: ${error.message}`, 'error');
  }
}

// Обработчики IPC

// Получение токена сервера
ipcMain.handle('get-server-token', () => {
  return serverToken;
});

// Регенерация токена сервера
ipcMain.handle('regenerate-server-token', () => {
  serverToken = generateToken();
  saveConfig();
  logMessage('Токен сервера обновлен');
  return serverToken;
});

// Получение подключений
ipcMain.handle('get-connections', () => {
  return connections;
});

// Отключение соединения
ipcMain.handle('disconnect-connection', (event, connectionId) => {
  const connectionIndex = connections.findIndex(conn => conn.id === connectionId);
  if (connectionIndex !== -1) {
    const connection = connections[connectionIndex];
    connections.splice(connectionIndex, 1);
    logMessage(`Соединение ${connection.name || connection.id} отключено`);
    return true;
  }
  return false;
});

// Получение задач
ipcMain.handle('get-tasks', () => {
  return tasks;
});

// Запуск задачи
ipcMain.handle('start-task', (event, taskId) => {
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].status = 'in_process';
    tasks[taskIndex].start_time = new Date().toISOString();
    logMessage(`Задача ${tasks[taskIndex].name} запущена`);
    return true;
  }
  return false;
});

// Остановка задачи
ipcMain.handle('stop-task', (event, taskId) => {
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].status = 'stopped';
    logMessage(`Задача ${tasks[taskIndex].name} остановлена`);
    return true;
  }
  return false;
});

// Получение файлов
ipcMain.handle('get-files', () => {
  return files;
});

// Загрузка файлов
ipcMain.handle('upload-files', async (event, formData) => {
  try {
    // Используем диалог для выбора файлов
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections']
    });
    
    if (result.canceled) {
      return false;
    }
    
    // Копируем выбранные файлы в папку хранилища
    for (const filePath of result.filePaths) {
      const fileName = path.basename(filePath);
      const fileId = uuidv4();
      const newFileName = `${fileId}${path.extname(fileName)}`;
      const destinationPath = path.join(storageDir, newFileName);
      
      fs.copyFileSync(filePath, destinationPath);
      
      const stats = fs.statSync(destinationPath);
      files.push({
        id: fileId,
        name: fileName,
        path: destinationPath,
        size: stats.size,
        createdAt: new Date()
      });
      
      logMessage(`Файл ${fileName} загружен`);
    }
    
    return true;
  } catch (error) {
    logMessage(`Ошибка загрузки файлов: ${error.message}`, 'error');
    return false;
  }
});

// Скачивание файла
ipcMain.handle('download-file', async (event, fileId) => {
  try {
    const file = files.find(f => f.id === fileId);
    if (!file) {
      logMessage(`Файл с id ${fileId} не найден`, 'error');
      return false;
    }
    
    const result = await dialog.showSaveDialog({
      title: 'Сохранить файл',
      defaultPath: path.join(app.getPath('downloads'), file.name),
      buttonLabel: 'Сохранить'
    });
    
    if (result.canceled) {
      return false;
    }
    
    fs.copyFileSync(file.path, result.filePath);
    logMessage(`Файл ${file.name} скачан`);
    return true;
  } catch (error) {
    logMessage(`Ошибка скачивания файла: ${error.message}`, 'error');
    return false;
  }
});

// Удаление файла
ipcMain.handle('delete-file', (event, fileId) => {
  try {
    const fileIndex = files.findIndex(file => file.id === fileId);
    if (fileIndex === -1) {
      logMessage(`Файл с id ${fileId} не найден`, 'error');
      return false;
    }
    
    const file = files[fileIndex];
    fs.unlinkSync(file.path);
    files.splice(fileIndex, 1);
    logMessage(`Файл ${file.name} удален`);
    return true;
  } catch (error) {
    logMessage(`Ошибка удаления файла: ${error.message}`, 'error');
    return false;
  }
});

// Получение логов
ipcMain.handle('get-logs', () => {
  return logs;
});

// Очистка логов
ipcMain.handle('clear-logs', () => {
  logs = [];
  logMessage('Логи очищены');
  return true;
});

// Добавляем обработчик для задач (добавление тестовых задач)
ipcMain.handle('add-test-tasks', () => {
  const newTasks = [
    {
      id: uuidv4(),
      name: 'Синхронизация данных',
      status: 'pending',
      workflow_id: 'wf_sync',
      start_time: null
    },
    {
      id: uuidv4(),
      name: 'Отправка уведомлений',
      status: 'in_process',
      workflow_id: 'wf_notify',
      start_time: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Создание отчета',
      status: 'done',
      workflow_id: 'wf_report',
      start_time: new Date(Date.now() - 3600000).toISOString()
    }
  ];
  
  tasks = [...tasks, ...newTasks];
  logMessage(`Добавлено ${newTasks.length} тестовых задач`);
  return tasks;
});

// Добавляем тестовые подключения
ipcMain.handle('add-test-connections', () => {
  const newConnections = [
    {
      id: uuidv4(),
      name: 'Клиент 1',
      ip: '192.168.1.100',
      connectedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Клиент 2',
      ip: '192.168.1.101',
      connectedAt: new Date(Date.now() - 1800000).toISOString()
    }
  ];
  
  connections = [...connections, ...newConnections];
  logMessage(`Добавлено ${newConnections.length} тестовых подключений`);
  return connections;
});

// Экспортируем API для использования в других файлах
export const serverAPI = {
  addConnection: (connection) => {
    const newConnection = {
      id: connection.id || uuidv4(),
      name: connection.name || 'Неизвестный клиент',
      ip: connection.ip || 'unknown',
      connectedAt: connection.connectedAt || new Date().toISOString()
    };
    
    connections.push(newConnection);
    logMessage(`Новое подключение: ${newConnection.name} (${newConnection.ip})`);
    return newConnection;
  },
  
  removeConnection: (connectionId) => {
    const connectionIndex = connections.findIndex(conn => conn.id === connectionId);
    if (connectionIndex !== -1) {
      const connection = connections[connectionIndex];
      connections.splice(connectionIndex, 1);
      logMessage(`Соединение ${connection.name} отключено`);
      return true;
    }
    return false;
  },
  
  addTask: (task) => {
    const newTask = {
      id: task.id || uuidv4(),
      name: task.name || 'Новая задача',
      status: task.status || 'pending',
      workflow_id: task.workflow_id || null,
      start_time: task.start_time || null
    };
    
    tasks.push(newTask);
    logMessage(`Добавлена новая задача: ${newTask.name}`);
    return newTask;
  },
  
  updateTaskStatus: (taskId, status) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = status;
      if (status === 'in_process' && !tasks[taskIndex].start_time) {
        tasks[taskIndex].start_time = new Date().toISOString();
      }
      logMessage(`Статус задачи ${tasks[taskIndex].name} изменен на ${status}`);
      return true;
    }
    return false;
  },
  
  getServerToken: () => serverToken,
  
  validateToken: (token) => token === serverToken,
  
  addFile: (fileInfo) => {
    const fileExists = files.some(f => f.id === fileInfo.id);
    if (!fileExists) {
      files.push(fileInfo);
      logMessage(`Добавлен новый файл: ${fileInfo.name}`);
      return true;
    }
    return false;
  },
  
  log: logMessage
};
