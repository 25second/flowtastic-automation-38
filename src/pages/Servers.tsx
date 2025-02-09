
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Trash2 } from 'lucide-react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

interface Server {
  id: string;
  name: string | null;
  url: string;
  is_active: boolean;
}

export default function Servers() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [serverToken, setServerToken] = useState('');
  const [serverName, setServerName] = useState('');
  const queryClient = useQueryClient();

  const { data: servers, isLoading } = useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load servers');
        throw error;
      }

      return data as Server[];
    },
  });

  const registerServer = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch('http://localhost:3001/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: serverToken })
        });

        if (!response.ok) throw new Error('Failed to register server');
        
        const { serverId } = await response.json();
        
        const { error } = await supabase
          .from('servers')
          .insert({
            id: serverId,
            name: serverName,
            url: 'http://localhost:3001',
            is_active: true
          });

        if (error) throw error;
        
        toast.success('Server registered successfully');
        setServerToken('');
        setServerName('');
        setShowAddDialog(false);
      } catch (error) {
        console.error('Server registration error:', error);
        toast.error('Failed to register server. Make sure the server is running on port 3001');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
    },
  });

  const deleteServer = useMutation({
    mutationFn: async (serverId: string) => {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', serverId);

      if (error) {
        toast.error('Failed to delete server');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      toast.success('Server deleted successfully');
    },
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1">
          <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Automation Servers</h1>
              <Button onClick={() => setShowAddDialog(true)}>Add Server</Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4">
                {servers?.map((server) => (
                  <div
                    key={server.id}
                    className="p-4 border rounded-lg flex items-center justify-between bg-white"
                  >
                    <div>
                      <h3 className="font-medium">{server.name || 'Unnamed Server'}</h3>
                      <p className="text-sm text-gray-600">{server.url}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            server.is_active ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span className="text-sm text-gray-600">
                          {server.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteServer.mutate(server.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Automation Server</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Server name"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                    />
                    <Input
                      placeholder="Enter server token"
                      value={serverToken}
                      onChange={(e) => setServerToken(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={() => registerServer.mutate()}
                    disabled={!serverToken || registerServer.isPending}
                  >
                    {registerServer.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      'Connect Server'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
