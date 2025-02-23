
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TableData } from '../types';
import { Json } from '@/integrations/supabase/types';

export const useCellEditing = (tableId: string, table: TableData | null, setTable: (table: TableData | null) => void) => {
  const [editValue, setEditValue] = useState('');

  const handleCellChange = async () => {
    if (!table?.data) return;

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({ data: table.data as Json })
        .eq('id', tableId);

      if (error) throw error;

      toast.success('Cell updated');
    } catch (error) {
      toast.error('Failed to update cell');
    }
  };

  return {
    editValue,
    setEditValue,
    handleCellChange
  };
};
