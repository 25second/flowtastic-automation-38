
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TableData } from '../types';
import { parseTableData } from '../utils';

export const useTableLoading = (tableId: string) => {
  const [table, setTable] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadTable();
  }, [tableId]);

  return {
    table,
    setTable,
    loading
  };
};
