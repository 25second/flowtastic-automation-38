
import React, { useState, useEffect } from 'react';
import { FileManager } from '@cubone/react-file-manager';
import '@cubone/react-file-manager/dist/style.css';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { baseServerUrl } from '@/utils/constants';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Files() {
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const baseUrl = baseServerUrl || 'http://localhost:3001';

  // Configuration for FileManager
  const config = {
    // Base URL for API requests
    baseURL: baseUrl,
    
    // URL for file upload
    uploadURL: `${baseUrl}/files/upload`,
    
    // URL for listing files
    listURL: `${baseUrl}/files/list`,
    
    // URL for downloading files
    downloadURL: `${baseUrl}/files/download`,
    
    // URL for deleting files
    deleteURL: `${baseUrl}/files/delete`,
    
    // URL for creating directories
    createFolderURL: `${baseUrl}/files/create-directory`,
    
    // URL for renaming files/directories
    renameURL: `${baseUrl}/files/rename`,
    
    // URL for moving files/directories
    moveURL: `${baseUrl}/files/move`,
    
    // URL for copying files/directories
    copyURL: `${baseUrl}/files/copy`,
    
    // Enable file upload
    enableUpload: true,
    
    // Enable directory creation
    enableCreateFolder: true,
    
    // Enable file/directory deletion
    enableDelete: true,
    
    // Enable file/directory renaming
    enableRename: true,
    
    // Enable file/directory moving
    enableMove: true,
    
    // Enable file/directory copying
    enableCopy: true,
    
    // Enable file download
    enableDownload: true,
    
    // Enable image preview
    enableImagePreview: true,
    
    // Enable PDF preview
    enablePdfPreview: true,
    
    // Enable video preview
    enableVideoPreview: true,
    
    // Enable audio preview
    enableAudioPreview: true,
    
    // Enable file sorting
    enableSort: true,
    
    // Enable file filtering
    enableFilter: true,
    
    // Enable file search
    enableSearch: true,
    
    // Enable drag and drop
    enableDragAndDrop: true,
    
    // Enable multi-selection
    enableMultiSelect: true,
    
    // Set maximum file size (10MB)
    maxFileSize: 10 * 1024 * 1024,
    
    // Set maximum number of files for upload
    maxFileCount: 10,
    
    // Set allowed file types
    allowedFileTypes: ['*'],
  };

  const handleError = (error: any) => {
    console.error('File manager error:', error);
    toast({
      title: 'Error',
      description: error.message || 'An error occurred while working with files',
      variant: 'destructive',
    });
  };

  const handleSuccess = (message: string) => {
    toast({
      title: 'Success',
      description: message,
    });
    // Update file list
    setRefreshKey(prev => prev + 1);
  };

  const handlePathChange = (path: string) => {
    setCurrentPath(path);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-8 p-6">
            <h1 className="text-3xl font-bold">File Manager</h1>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
          </div>
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
    </SidebarProvider>
  );
}
