
import React, { useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import "handsontable/dist/handsontable.full.min.css";
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TableData } from './types';
import { Save } from 'lucide-react';

// Register Handsontable modules
registerAllModules();

interface TableEditorProps {
  tableId: string;
}

export function TableEditor({ tableId }: TableEditorProps) {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTableData();
  }, [tableId]);

  const loadTableData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('custom_tables')
        .select('*')
        .eq('id', tableId)
        .single();

      if (error) throw error;

      // Преобразуем данные из JSON в правильный формат TableData
      const parsedData: TableData = {
        id: data.id,
        name: data.name,
        columns: data.columns as Column[],
        data: data.data as any[][],
        cell_status: data.cell_status as boolean[][]
      };

      setTableData(parsedData);
    } catch (error) {
      console.error('Error loading table:', error);
      toast.error('Ошибка при загрузке таблицы');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!tableData) return;

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({
          data: tableData.data,
          updated_at: new Date().toISOString()
        })
        .eq('id', tableId);

      if (error) throw error;

      toast.success('Таблица сохранена');
    } catch (error) {
      console.error('Error saving table:', error);
      toast.error('Ошибка при сохранении таблицы');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse">Загрузка...</div>
      </div>
    );
  }

  if (!tableData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-destructive">Таблица не найдена</div>
      </div>
    );
  }

  const hotSettings = {
    data: tableData.data,
    colHeaders: tableData.columns.map(col => col.name),
    rowHeaders: true,
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation',
    stretchH: 'all',
    contextMenu: true,
    manualColumnResize: true,
    manualRowResize: true,
    allowInsertRow: true,
    allowInsertColumn: true,
    allowRemoveRow: true,
    allowRemoveColumn: true,
    afterChange: (changes: any) => {
      if (changes) {
        setTableData(prev => {
          if (!prev) return prev;
          const newData = [...prev.data];
          changes.forEach(([row, col, oldValue, newValue]: [number, number, any, any]) => {
            newData[row][col] = newValue;
          });
          return { ...prev, data: newData };
        });
      }
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{tableData.name}</h1>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Сохранить
        </Button>
      </div>
      <Card className="p-4">
        <HotTable settings={hotSettings} />
      </Card>
    </div>
  );
}
