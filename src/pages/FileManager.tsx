
import React, { useState, useEffect } from 'react';
import { FileManager } from '@cubone/react-file-manager';
import '@cubone/react-file-manager/dist/style.css';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { baseServerUrl } from '@/utils/constants';

export default function FileManagerPage() {
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const baseUrl = baseServerUrl || 'http://localhost:3001';

  // Конфигурация для FileManager
  const config = {
    // Базовый URL для запросов к API
    baseURL: baseUrl,
    
    // URL для загрузки файлов
    uploadURL: `${baseUrl}/files/upload`,
    
    // URL для получения списка файлов
    listURL: `${baseUrl}/files/list`,
    
    // URL для скачивания файлов
    downloadURL: `${baseUrl}/files/download`,
    
    // URL для удаления файлов
    deleteURL: `${baseUrl}/files/delete`,
    
    // URL для создания директории
    createFolderURL: `${baseUrl}/files/create-directory`,
    
    // URL для переименования файлов/директорий
    renameURL: `${baseUrl}/files/rename`,
    
    // URL для перемещения файлов/директорий
    moveURL: `${baseUrl}/files/move`,
    
    // URL для копирования файлов/директорий
    copyURL: `${baseUrl}/files/copy`,
    
    // Включаем возможность загрузки файлов
    enableUpload: true,
    
    // Включаем возможность создания директорий
    enableCreateFolder: true,
    
    // Включаем возможность удаления файлов/директорий
    enableDelete: true,
    
    // Включаем возможность переименования файлов/директорий
    enableRename: true,
    
    // Включаем возможность перемещения файлов/директорий
    enableMove: true,
    
    // Включаем возможность копирования файлов/директорий
    enableCopy: true,
    
    // Включаем возможность скачивания файлов
    enableDownload: true,
    
    // Включаем предпросмотр изображений
    enableImagePreview: true,
    
    // Включаем просмотр PDF файлов
    enablePdfPreview: true,
    
    // Включаем просмотр видео файлов
    enableVideoPreview: true,
    
    // Включаем просмотр аудио файлов
    enableAudioPreview: true,
    
    // Включаем сортировку файлов
    enableSort: true,
    
    // Включаем фильтрацию файлов
    enableFilter: true,
    
    // Включаем поиск файлов
    enableSearch: true,
    
    // Включаем перетаскивание файлов
    enableDragAndDrop: true,
    
    // Включаем выбор нескольких файлов
    enableMultiSelect: true,
    
    // Устанавливаем максимальный размер файла (10MB)
    maxFileSize: 10 * 1024 * 1024,
    
    // Устанавливаем максимальное количество файлов для загрузки
    maxFileCount: 10,
    
    // Устанавливаем разрешенные типы файлов
    allowedFileTypes: ['*'],
  };

  const handleError = (error: any) => {
    console.error('Ошибка в файловом менеджере:', error);
    toast({
      title: 'Ошибка',
      description: error.message || 'Произошла ошибка при работе с файлами',
      variant: 'destructive',
    });
  };

  const handleSuccess = (message: string) => {
    toast({
      title: 'Успешно',
      description: message,
    });
    // Обновляем список файлов
    setRefreshKey(prev => prev + 1);
  };

  const handlePathChange = (path: string) => {
    setCurrentPath(path);
  };

  return (
    <div className="flex h-screen">
      <DashboardSidebar onNewWorkflow={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Файловый менеджер" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full overflow-hidden">
            <ScrollArea className="h-full w-full">
              <FileManager
                key={refreshKey}
                config={config}
                onError={handleError}
                onSuccess={(message) => handleSuccess(message)}
                onPathChange={handlePathChange}
                defaultPath={currentPath}
                className="h-full w-full p-4"
              />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
