
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TableData, ActiveCell } from '../types';
import { parseTableData, columnsToJson } from '../utils';
import { Json } from '@/integrations/supabase/types';
import * as XLSX from 'xlsx';

export const useTableState = (tableId: string) => {
  const [table, setTable] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnName, setEditingColumnName] = useState('');
  const [resizing, setResizing] = useState<{ columnId: string; startX: number } | null>(null);

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

  const handleColumnHeaderClick = (columnId: string, columnName: string) => {
    setEditingColumnId(columnId);
    setEditingColumnName(columnName);
  };

  const handleColumnNameChange = async () => {
    if (!editingColumnId || !table) return;

    const newColumns = table.columns.map(col => 
      col.id === editingColumnId 
        ? { ...col, name: editingColumnName }
        : col
    );

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({ columns: columnsToJson(newColumns) })
        .eq('id', tableId);

      if (error) throw error;

      setTable({ ...table, columns: newColumns });
      setEditingColumnId(null);
      toast.success('Column name updated');
    } catch (error) {
      toast.error('Failed to update column name');
    }
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

  const exportTable = (format: 'csv' | 'xlsx' | 'numbers') => {
    if (!table) return;

    try {
      const headers = table.columns.map(col => col.name);
      const exportData = [headers, ...table.data];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const fileName = `${table.name}_${new Date().toISOString().split('T')[0]}`;

      switch (format) {
        case 'csv':
          XLSX.writeFile(wb, `${fileName}.csv`);
          break;
        case 'xlsx':
          XLSX.writeFile(wb, `${fileName}.xlsx`);
          break;
        case 'numbers':
          XLSX.writeFile(wb, `${fileName}.numbers`);
          break;
      }

      toast.success(`Table exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export table');
    }
  };

  const importTable = async (file: File) => {
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length < 2) {
          toast.error('File contains no data');
          return;
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);

        const newColumns = headers.map((header, index) => ({
          id: table?.columns[index]?.id || crypto.randomUUID(),
          name: header,
          type: 'text' as const
        }));

        try {
          const { error } = await supabase
            .from('custom_tables')
            .update({
              columns: columnsToJson(newColumns),
              data: rows as unknown as Json
            })
            .eq('id', tableId);

          if (error) throw error;

          setTable(prevTable => ({
            ...prevTable!,
            columns: newColumns,
            data: rows
          }));

          toast.success('Table imported successfully');
        } catch (error) {
          toast.error('Failed to update table data');
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast.error('Failed to import file');
    }
  };

  const handleResizeStart = (columnId: string, e: React.MouseEvent) => {
    setResizing({
      columnId,
      startX: e.pageX
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (resizing && table) {
        const diff = e.pageX - resizing.startX;
        const newColumns = table.columns.map(col => {
          if (col.id === resizing.columnId) {
            const newWidth = (col.width || MIN_COLUMN_WIDTH) + diff;
            return {
              ...col,
              width: Math.max(MIN_COLUMN_WIDTH, newWidth)
            };
          }
          return col;
        });

        setTable(prev => prev ? { ...prev, columns: newColumns } : null);
      }
    };

    const handleMouseUp = async () => {
      if (table) {
        try {
          const { error } = await supabase
            .from('custom_tables')
            .update({ columns: columnsToJson(table.columns) })
            .eq('id', tableId);

          if (error) throw error;
        } catch (error) {
          toast.error('Failed to save column widths');
        }
      }
      setResizing(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    loadTable();
  }, [tableId]);

  return {
    table,
    loading,
    activeCell,
    editValue,
    editingColumnId,
    editingColumnName,
    setEditValue,
    handleCellClick,
    handleColumnHeaderClick,
    handleColumnNameChange,
    handleCellChange,
    handleResizeStart,
    addRow,
    addColumn,
    exportTable,
    importTable
  };
};

export const MIN_COLUMN_WIDTH = 100;
