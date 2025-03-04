
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { CustomTable } from '@/components/tables/types';
import * as XLSX from 'xlsx';

export function useTableOperations() {
  const [isCreating, setIsCreating] = useState(false);

  const { data: tables, isLoading, refetch } = useQuery({
    queryKey: ['custom_tables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_tables')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load tables');
        throw error;
      }

      return data as CustomTable[];
    },
  });

  const handleCreateTable = async ({ name, description, columnCount, category }: {
    name: string;
    description: string;
    columnCount: number;
    category?: string;
  }) => {
    if (!name.trim()) {
      toast.error('Table name is required');
      return;
    }

    const columns = Array.from({ length: columnCount }, (_, index) => ({
      id: crypto.randomUUID(),
      name: `Column ${index + 1}`,
      type: 'text'
    }));

    const data = [Array(columnCount).fill('')];

    const { error } = await supabase
      .from('custom_tables')
      .insert([
        {
          name: name.trim(),
          description: description.trim() || null,
          columns,
          data,
          category: category || null
        }
      ]);

    if (error) {
      toast.error('Failed to create table');
      return;
    }

    toast.success('Table created successfully');
    setIsCreating(false);
    refetch();
  };

  const handleImportTable = async ({ name, description, file, category }: {
    name: string;
    description: string;
    file: File;
    category?: string;
  }) => {
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

        const columns = headers.map(header => ({
          id: crypto.randomUUID(),
          name: header,
          type: 'text'
        }));

        const { error } = await supabase
          .from('custom_tables')
          .insert([
            {
              name: name || file.name.split('.')[0],
              description: description || null,
              columns,
              data: rows,
              category: category || null
            }
          ]);

        if (error) throw error;

        toast.success('Table imported successfully');
        setIsCreating(false);
        refetch();
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast.error('Failed to import table');
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;

    const { error } = await supabase
      .from('custom_tables')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete table');
      return;
    }

    toast.success('Table deleted successfully');
    refetch();
  };

  return {
    tables,
    isLoading,
    isCreating,
    setIsCreating,
    handleCreateTable,
    handleImportTable,
    handleDeleteTable
  };
}
