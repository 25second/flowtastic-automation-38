
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface TableEditorProps {
  tableId: string;
}

interface Column {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date';
}

interface TableData {
  id: string;
  name: string;
  columns: Column[];
  data: any[][];
}

function parseTableData(rawData: any): TableData {
  return {
    id: rawData.id,
    name: rawData.name,
    columns: Array.isArray(rawData.columns) ? rawData.columns : [],
    data: Array.isArray(rawData.data) ? rawData.data : []
  };
}

export function TableEditor({ tableId }: TableEditorProps) {
  const navigate = useNavigate();
  const [table, setTable] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadTable();
  }, [tableId]);

  const loadTable = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_tables')
        .select('*')
        .eq('id', tableId)
        .single();

      if (error) throw error;

      setTable(parseTableData(data));
    } catch (error) {
      toast.error('Failed to load table');
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (row: number, col: number, value: any) => {
    setActiveCell({ row, col });
    setEditValue(value?.toString() || '');
  };

  const handleCellChange = async () => {
    if (!activeCell || !table) return;

    const newData = [...table.data];
    newData[activeCell.row][activeCell.col] = editValue;

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({ data: newData as Json })
        .eq('id', tableId);

      if (error) throw error;

      setTable({ ...table, data: newData });
      setActiveCell(null);
      toast.success('Cell updated');
    } catch (error) {
      toast.error('Failed to update cell');
    }
  };

  const addColumn = async () => {
    if (!table) return;

    const newColumn: Column = {
      id: crypto.randomUUID(),
      name: `Column ${table.columns.length + 1}`,
      type: 'text'
    };

    const newColumns = [...table.columns, newColumn];
    const newData = table.data.map(row => [...row, '']);

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({
          columns: newColumns as Json,
          data: newData as Json
        })
        .eq('id', tableId);

      if (error) throw error;

      setTable({ ...table, columns: newColumns, data: newData });
      toast.success('Column added');
    } catch (error) {
      toast.error('Failed to add column');
    }
  };

  const addRow = async () => {
    if (!table) return;

    const newRow = new Array(table.columns.length).fill('');
    const newData = [...table.data, newRow];

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({ data: newData as Json })
        .eq('id', tableId);

      if (error) throw error;

      setTable({ ...table, data: newData });
      toast.success('Row added');
    } catch (error) {
      toast.error('Failed to add row');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!table) {
    return <div className="p-8">Table not found</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-4 p-4 border-b">
        <Button variant="ghost" onClick={() => navigate('/tables')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold">{table.name}</h1>
        <div className="ml-auto space-x-2">
          <Button onClick={addColumn} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Column
          </Button>
          <Button onClick={addRow} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Row
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="inline-block min-w-full">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {table.columns.map((column, index) => (
                  <th
                    key={column.id}
                    className="sticky top-0 bg-gray-100 px-4 py-2 text-left text-sm font-semibold border"
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className="border px-4 py-2 text-sm"
                      onClick={() => handleCellClick(rowIndex, colIndex, cell)}
                    >
                      {activeCell?.row === rowIndex && activeCell?.col === colIndex ? (
                        <Input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellChange}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCellChange();
                            }
                          }}
                          className="p-0 h-6 border-0 focus-visible:ring-0"
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
}
