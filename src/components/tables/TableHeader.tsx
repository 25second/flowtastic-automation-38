
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TableHeaderProps {
  tableName: string;
  onAddColumn: () => void;
  onAddRow: () => void;
}

export function TableHeader({ tableName, onAddColumn, onAddRow }: TableHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Button variant="ghost" onClick={() => navigate('/tables')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <h1 className="text-xl font-semibold">{tableName}</h1>
      <div className="ml-auto space-x-2">
        <Button onClick={onAddColumn} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Column
        </Button>
        <Button onClick={onAddRow} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Row
        </Button>
      </div>
    </div>
  );
}
