
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ServerCard } from '@/components/servers/ServerCard';
import { AddServerDialog } from '@/components/servers/AddServerDialog';
import { useServerManagement } from '@/hooks/useServerManagement';

export default function Servers() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { 
    servers, 
    isLoading, 
    checkServerStatus, 
    registerServer, 
    deleteServer 
  } = useServerManagement();

  // Check server status once when component mounts
  useEffect(() => {
    if (!servers) return;
    
    // Check all servers once
    servers.forEach(server => checkServerStatus(server));
  }, [servers, checkServerStatus]);

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
                  <ServerCard
                    key={server.id}
                    server={server}
                    onDelete={(id) => deleteServer.mutate(id)}
                  />
                ))}
              </div>
            )}

            <AddServerDialog
              open={showAddDialog}
              onOpenChange={setShowAddDialog}
              onRegister={(data) => registerServer.mutate(data)}
              isRegistering={registerServer.isPending}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
