
// Маршруты для работы с файловым менеджером
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Создаем директорию для хранения файлов
const storagePath = path.join(__dirname, '../storage');
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

// Настраиваем хранилище для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const directory = req.query.directory || '';
    const fullPath = path.join(storagePath, directory);
    
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage: storage });
const router = express.Router();

// Получение списка файлов и директорий
router.get('/list', (req, res) => {
  try {
    const directory = req.query.directory || '';
    const fullPath = path.join(storagePath, directory);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Директория не существует' 
      });
    }
    
    const items = fs.readdirSync(fullPath).map(item => {
      const itemPath = path.join(fullPath, item);
      const stats = fs.statSync(itemPath);
      const isDirectory = stats.isDirectory();
      
      return {
        id: item,
        name: item,
        path: path.join(directory, item).replace(/\\/g, '/'),
        isDirectory,
        size: isDirectory ? 0 : stats.size,
        lastModified: stats.mtime.toISOString(),
        type: isDirectory ? 'directory' : path.extname(item).slice(1) || 'file'
      };
    });
    
    res.json({ 
      success: true, 
      data: items,
      currentPath: directory
    });
  } catch (error) {
    console.error('Ошибка при получении списка файлов:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Не удалось получить список файлов',
      error: error.message
    });
  }
});

// Загрузка файла
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Файл не загружен' 
      });
    }
    
    const fileInfo = {
      id: path.basename(req.file.path),
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path.replace(storagePath, '').replace(/\\/g, '/'),
      size: req.file.size,
      mimetype: req.file.mimetype
    };
    
    res.json({ 
      success: true, 
      message: 'Файл успешно загружен',
      file: fileInfo
    });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Не удалось загрузить файл',
      error: error.message
    });
  }
});

// Загрузка нескольких файлов
router.post('/upload-multiple', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Файлы не загружены' 
      });
    }
    
    const filesInfo = req.files.map(file => ({
      id: path.basename(file.path),
      originalName: file.originalname,
      filename: file.filename,
      path: file.path.replace(storagePath, '').replace(/\\/g, '/'),
      size: file.size,
      mimetype: file.mimetype
    }));
    
    res.json({ 
      success: true, 
      message: `Успешно загружено ${req.files.length} файлов`,
      files: filesInfo
    });
  } catch (error) {
    console.error('Ошибка при загрузке файлов:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Не удалось загрузить файлы',
      error: error.message
    });
  }
});

// Скачивание файла
router.get('/download/:filePath(*)', (req, res) => {
  try {
    const filePath = req.params.filePath;
    const fullPath = path.join(storagePath, filePath);
    
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      return res.status(404).json({ 
        success: false, 
        message: 'Файл не найден' 
      });
    }
    
    res.download(fullPath);
  } catch (error) {
    console.error('Ошибка при скачивании файла:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Не удалось скачать файл',
      error: error.message
    });
  }
});

// Удаление файла
router.delete('/delete/:filePath(*)', (req, res) => {
  try {
    const filePath = req.params.filePath;
    const fullPath = path.join(storagePath, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Файл не найден' 
      });
    }
    
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      fs.rmdirSync(fullPath, { recursive: true });
      res.json({ 
        success: true, 
        message: 'Директория успешно удалена' 
      });
    } else {
      fs.unlinkSync(fullPath);
      res.json({ 
        success: true, 
        message: 'Файл успешно удален' 
      });
    }
  } catch (error) {
    console.error('Ошибка при удалении файла:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Не удалось удалить файл',
      error: error.message
    });
  }
});

// Создание директории
router.post('/create-directory', (req, res) => {
  try {
    const { directory, name } = req.body;
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Имя директории не указано' 
      });
    }
    
    const parentPath = directory ? path.join(storagePath, directory) : storagePath;
    const newDirPath = path.join(parentPath, name);
    
    if (fs.existsSync(newDirPath)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Директория с таким именем уже существует' 
      });
    }
    
    fs.mkdirSync(newDirPath, { recursive: true });
    
    res.json({ 
      success: true, 
      message: 'Директория успешно создана',
      directory: {
        id: name,
        name: name,
        path: directory ? path.join(directory, name).replace(/\\/g, '/') : name,
        isDirectory: true,
        size: 0,
        lastModified: new Date().toISOString(),
        type: 'directory'
      }
    });
  } catch (error) {
    console.error('Ошибка при создании директории:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Не удалось создать директорию',
      error: error.message
    });
  }
});

// Переименование файла или директории
router.post('/rename', (req, res) => {
  try {
    const { path: filePath, newName } = req.body;
    if (!filePath || !newName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Путь к файлу или новое имя не указаны' 
      });
    }
    
    const fullPath = path.join(storagePath, filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Файл не найден' 
      });
    }
    
    const dirPath = path.dirname(fullPath);
    const ext = path.extname(fullPath);
    const newPath = path.join(dirPath, newName + ext);
    
    if (fs.existsSync(newPath)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Файл с таким именем уже существует' 
      });
    }
    
    fs.renameSync(fullPath, newPath);
    
    const relativePath = path.relative(storagePath, newPath).replace(/\\/g, '/');
    
    res.json({ 
      success: true, 
      message: 'Файл успешно переименован',
      file: {
        id: path.basename(newPath),
        name: path.basename(newPath),
        path: relativePath,
        isDirectory: fs.statSync(newPath).isDirectory(),
        size: fs.statSync(newPath).size,
        lastModified: fs.statSync(newPath).mtime.toISOString(),
        type: path.extname(newPath).slice(1) || 'file'
      }
    });
  } catch (error) {
    console.error('Ошибка при переименовании файла:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Не удалось переименовать файл',
      error: error.message
    });
  }
});

// Перемещение файла или директории
router.post('/move', (req, res) => {
  try {
    const { sourcePath, destinationPath } = req.body;
    if (!sourcePath || !destinationPath) {
      return res.status(400).json({ 
        success: false, 
        message: 'Исходный или целевой путь не указаны' 
      });
    }
    
    const fullSourcePath = path.join(storagePath, sourcePath);
    const fullDestPath = path.join(storagePath, destinationPath);
    
    if (!fs.existsSync(fullSourcePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Исходный файл не найден' 
      });
    }
    
    if (!fs.existsSync(fullDestPath)) {
      fs.mkdirSync(fullDestPath, { recursive: true });
    }
    
    const fileName = path.basename(fullSourcePath);
    const newPath = path.join(fullDestPath, fileName);
    
    fs.renameSync(fullSourcePath, newPath);
    
    const relativePath = path.relative(storagePath, newPath).replace(/\\/g, '/');
    
    res.json({ 
      success: true, 
      message: 'Файл успешно перемещен',
      file: {
        id: fileName,
        name: fileName,
        path: relativePath,
        isDirectory: fs.statSync(newPath).isDirectory(),
        size: fs.statSync(newPath).size,
        lastModified: fs.statSync(newPath).mtime.toISOString(),
        type: path.extname(newPath).slice(1) || 'file'
      }
    });
  } catch (error) {
    console.error('Ошибка при перемещении файла:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Не удалось переместить файл',
      error: error.message
    });
  }
});

// Копирование файла или директории
router.post('/copy', (req, res) => {
  try {
    const { sourcePath, destinationPath } = req.body;
    if (!sourcePath || !destinationPath) {
      return res.status(400).json({ 
        success: false, 
        message: 'Исходный или целевой путь не указаны' 
      });
    }
    
    const fullSourcePath = path.join(storagePath, sourcePath);
    const fullDestPath = path.join(storagePath, destinationPath);
    
    if (!fs.existsSync(fullSourcePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Исходный файл не найден' 
      });
    }
    
    if (!fs.existsSync(fullDestPath)) {
      fs.mkdirSync(fullDestPath, { recursive: true });
    }
    
    const fileName = path.basename(fullSourcePath);
    const newPath = path.join(fullDestPath, fileName);
    
    // Копирование файла или директории
    const copyRecursive = (src, dest) => {
      const stats = fs.statSync(src);
      if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(childItem => {
          copyRecursive(path.join(src, childItem), path.join(dest, childItem));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    };
    
    copyRecursive(fullSourcePath, newPath);
    
    const relativePath = path.relative(storagePath, newPath).replace(/\\/g, '/');
    
    res.json({ 
      success: true, 
      message: 'Файл успешно скопирован',
      file: {
        id: fileName,
        name: fileName,
        path: relativePath,
        isDirectory: fs.statSync(newPath).isDirectory(),
        size: fs.statSync(newPath).size,
        lastModified: fs.statSync(newPath).mtime.toISOString(),
        type: path.extname(newPath).slice(1) || 'file'
      }
    });
  } catch (error) {
    console.error('Ошибка при копировании файла:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Не удалось скопировать файл',
      error: error.message
    });
  }
});

export default router;
