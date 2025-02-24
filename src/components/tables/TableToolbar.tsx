
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Plus, Download, Upload } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TableToolbarProps {
  tableName: string;
  onNavigateBack: () => void;
  onAddRow: () => void;
  onAddColumn: () => void;
  onExportCsv: () => void;
  onExportXlsx: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  tableName,
  onNavigateBack,
  onAddRow,
  onAddColumn,
  onExportCsv,
  onExportXlsx,
  onImport,
  onSave,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 h-14">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onNavigateBack}
          className="hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold tracking-tight">{tableName}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onAddRow} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить строку
        </Button>
        
        <Button variant="outline" onClick={onAddColumn} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить колонку
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Экспорт
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onExportCsv}>
              Экспорт в CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportXlsx}>
              Экспорт в XLSX
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Импорт
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => document.getElementById('csv-import')?.click()}>
              Импорт из CSV
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => document.getElementById('xlsx-import')?.click()}>
              Импорт из XLSX
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="file"
          id="csv-import"
          accept=".csv"
          className="hidden"
          onChange={onImport}
        />
        <input
          type="file"
          id="xlsx-import"
          accept=".xlsx"
          className="hidden"
          onChange={onImport}
        />

        <Button onClick={onSave} className="gap-2">
          <Save className="h-4 w-4" />
          Сохранить
        </Button>
      </div>
    </div>
  );
};
