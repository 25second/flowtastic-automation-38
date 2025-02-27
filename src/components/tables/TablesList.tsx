
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { CustomTable } from './types';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableItem } from './TableItem';
import { TableActions } from './TableActions';
import { formatDate } from './utils/formatters';
import { parseTableData } from './utils';
import * as XLSX from 'xlsx';

export function TablesList() {
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

  const handleCreateTable = async ({ name, description, columnCount }: {
    name: string;
    description: string;
    columnCount: number;
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
          data
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

  const handleImportTable = async ({ name, description, file }: {
    name: string;
    description: string;
    file: File;
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
              data: rows
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

  return (
    <div className="flex-1 p-8">
      <TableActions 
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        onCreateTable={handleCreateTable}
        onImportTable={handleImportTable}
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableCaption>A list of your custom tables.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Columns</TableHead>
              <TableHead>Rows</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables?.map((table) => (
              <TableItem 
                key={table.id}
                table={table}
                onDelete={handleDeleteTable}
                formatDate={formatDate}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
