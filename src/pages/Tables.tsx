
import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Plus } from 'lucide-react';
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

interface CustomTable {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  columns: any[];
  data: any[];
}

export default function Tables() {
  const [isCreating, setIsCreating] = useState(false);

  const { data: tables, isLoading } = useQuery({
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Tables</h1>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Table
            </Button>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables?.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell>{table.description}</TableCell>
                    <TableCell>{table.columns.length}</TableCell>
                    <TableCell>{table.data.length}</TableCell>
                    <TableCell>{new Date(table.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(table.updated_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
