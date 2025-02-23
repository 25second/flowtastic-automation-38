
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { TableHeader } from './TableHeader';
import { EditableCell } from './EditableCell';
import { TableData, TableEditorProps, ActiveCell } from './types';
import { parseTableData, columnsToJson } from './utils';

export function TableEditor({ tableId }: TableEditorProps) {
  const [table, setTable] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
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
        .update({ data: newData as unknown as Json })
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

    const newColumn = {
      id: crypto.randomUUID(),
      name: `Column ${table.columns.length + 1}`,
      type: 'text' as const
    };

    const newColumns = [...table.columns, newColumn];
    const newData = table.data.map(row => [...row, '']);

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({
          columns: columnsToJson(newColumns),
          data: newData as unknown as Json
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
        .update({ data: newData as unknown as Json })
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
    <div className="flex flex-col h-screen w-full">
      <TableHeader
        tableName={table.name}
        onAddColumn={addColumn}
        onAddRow={addRow}
      />
      <ScrollArea className="flex-1 w-full">
        <div className="w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {table.columns.map((column) => (
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
                    <EditableCell
                      key={`${rowIndex}-${colIndex}`}
                      value={cell}
                      isEditing={activeCell?.row === rowIndex && activeCell?.col === colIndex}
                      editValue={editValue}
                      onValueChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellChange}
                      onClick={() => handleCellClick(rowIndex, colIndex, cell)}
                    />
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
