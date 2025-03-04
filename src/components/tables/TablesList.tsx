
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
import { formatDate } from './utils/formatters';
import { parseTableData } from './utils';
import * as XLSX from 'xlsx';
import { TableCategories } from './categories/TableCategories';
import { useTableCategories } from '@/hooks/tables/useTableCategories';
import { TablePageHeader } from './TablePageHeader';
import { TableSearchBar } from './TableSearchBar';
import { TableActions } from './TableActions';

export function TablesList() {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    categories,
    loading: categoriesLoading,
    selectedCategory,
    setSelectedCategory,
    addCategory,
    deleteCategory,
    editCategory
  } = useTableCategories();

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

  // Фильтрация таблиц по категории и поиску
  const filteredTables = tables?.filter(table => {
    const matchesCategory = !selectedCategory || table.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (table.description && table.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleAddTable = () => {
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      <TablePageHeader onAddTable={handleAddTable} />
      
      <TableCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onEditCategory={editCategory}
        isLoading={categoriesLoading}
      />

      <TableSearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddTable={handleAddTable}
      />

      <TableActions 
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        onCreateTable={handleCreateTable}
        onImportTable={handleImportTable}
        categories={categories}
        selectedCategory={selectedCategory}
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableCaption>A list of your custom tables.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Columns</TableHead>
              <TableHead>Rows</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTables?.map((table) => (
              <TableItem 
                key={table.id}
                table={table}
                onDelete={handleDeleteTable}
                formatDate={formatDate}
                categoryName={categories.find(c => c.id === table.category)?.name}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
