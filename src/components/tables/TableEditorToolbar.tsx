
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TableEditorToolbarProps {
  tableName: string;
  onSave: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportExcel: () => void;
  onExportCSV: () => void;
}

export function TableEditorToolbar({
  tableName,
  onSave,
  onImport,
  onExportExcel,
  onExportCSV
}: TableEditorToolbarProps) {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-4 border-b">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/tables')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-2xl font-semibold">{tableName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".xlsx,.csv"
            onChange={onImport}
          />
          <Button 
            variant="outline"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Импорт
          </Button>
          <Button variant="outline" onClick={onExportExcel}>
            <Download className="w-4 h-4 mr-2" />
            XLSX
          </Button>
          <Button variant="outline" onClick={onExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}
