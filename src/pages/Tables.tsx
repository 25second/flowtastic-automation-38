
import { useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreateTableDialog } from '@/components/tables/CreateTableDialog';
import * as XLSX from 'xlsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { TableEditor } from '@/components/tables/TableEditor';

interface CustomTable {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  columns: any[];
  data: any[];
}

function TablesList() {
  const navigate = useNavigate();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tables</h1>
        <Button className="gap-2" onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4" />
          New Table
        </Button>
      </div>

      <CreateTableDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
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
              <TableRow key={table.id}>
                <TableCell className="font-medium">{table.name}</TableCell>
                <TableCell>{table.description}</TableCell>
                <TableCell>{table.columns.length}</TableCell>
                <TableCell>{table.data.length}</TableCell>
                <TableCell>{formatDate(table.created_at)}</TableCell>
                <TableCell>{formatDate(table.updated_at)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/tables/${table.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/tables/${table.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteTable(table.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function TableEditorWrapper() {
  const { tableId } = useParams();
  
  if (!tableId) {
    return <div>Table ID not found</div>;
  }

  return (
    <div className="w-full h-screen">
      <TableEditor tableId={tableId} />
    </div>
  );
}

export default function Tables() {
  return (
    <Routes>
      <Route index element={
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <DashboardSidebar onNewWorkflow={() => {}} />
            <TablesList />
          </div>
        </SidebarProvider>
      } />
      <Route path=":tableId" element={<TableEditorWrapper />} />
    </Routes>
  );
}
