
import React, { useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import "handsontable/dist/handsontable.full.min.css";
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TableData, Column } from './types';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Register Handsontable modules
registerAllModules();

interface TableEditorProps {
  tableId: string;
}

export function TableEditor({ tableId }: TableEditorProps) {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

      // Проверяем и преобразуем columns в правильный формат
      const columns = Array.isArray(data.columns) 
        ? data.columns.map((col: any): Column => ({
            id: col.id || '',
            name: col.name || '',
            type: col.type || 'text',
            width: col.width
          }))
        : [];

      // Преобразуем данные из JSON в правильный формат TableData
      const parsedData: TableData = {
        id: data.id,
        name: data.name,
        columns: columns,
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
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-pulse text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  if (!tableData) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
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
    stretchH: 'all' as const,
    contextMenu: true,
    manualColumnResize: true,
    manualRowResize: true,
    allowInsertRow: true,
    allowInsertColumn: true,
    allowRemoveRow: true,
    allowRemoveColumn: true,
    className: 'htDarkTheme',
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/tables')}
                className="hover:bg-accent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-semibold tracking-tight">{tableData.name}</h1>
            </div>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Сохранить
            </Button>
          </div>

          {/* Table Card */}
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <div className="rounded-md border border-border overflow-hidden">
                <HotTable settings={hotSettings} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
