
import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [newTableName, setNewTableName] = useState('');
  const [newTableDescription, setNewTableDescription] = useState('');

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

  const handleCreateTable = async () => {
    if (!newTableName.trim()) {
      toast.error('Table name is required');
      return;
    }

    const { error } = await supabase
      .from('custom_tables')
      .insert([
        {
          name: newTableName.trim(),
          description: newTableDescription.trim() || null,
          columns: [],
          data: []
        }
      ]);

    if (error) {
      toast.error('Failed to create table');
      return;
    }

    toast.success('Table created successfully');
    setIsCreating(false);
    setNewTableName('');
    setNewTableDescription('');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tables</h1>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Table</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="font-medium">Table Name</label>
                <Input
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="Enter table name"
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium">Description (Optional)</label>
                <Textarea
                  value={newTableDescription}
                  onChange={(e) => setNewTableDescription(e.target.value)}
                  placeholder="Enter table description"
                />
              </div>
              <Button onClick={handleCreateTable} className="w-full">
                Create Table
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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

export default function Tables() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <Routes>
          <Route index element={<TablesList />} />
          <Route path=":tableId" element={<TableEditor tableId="placeholder" />} />
        </Routes>
      </div>
    </SidebarProvider>
  );
}
