
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Upload, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TableHeaderProps {
  tableName: string;
  onAddColumn: () => void;
  onAddRow: () => void;
  onExport: (format: 'csv' | 'xlsx' | 'numbers') => void;
  onImport: (file: File) => void;
}

export function TableHeader({ 
  tableName, 
  onAddColumn, 
  onAddRow, 
  onExport,
  onImport 
}: TableHeaderProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <Button variant="ghost" onClick={() => navigate('/tables')}>
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <h1 className="text-xl font-semibold ml-4">{tableName}</h1>

      <div className="flex items-center gap-2 ml-auto">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.xlsx,.numbers"
          className="hidden"
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onExport('csv')}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('xlsx')}>
              Export as XLSX
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('numbers')}>
              Export as Numbers
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </div>
    </div>
  );
}
