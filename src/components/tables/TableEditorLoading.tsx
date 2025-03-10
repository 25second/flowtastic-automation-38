
import React from 'react';

interface TableEditorLoadingProps {
  message?: string;
}

export function TableEditorLoading({ message = 'Загрузка...' }: TableEditorLoadingProps) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse">{message}</div>
    </div>
  );
}
