
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ShareResourcesDialogProps {
  team: { id: string; name: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResourcesShared: () => void;
}

export function ShareResourcesDialog({ team, open, onOpenChange, onResourcesShared }: ShareResourcesDialogProps) {
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: workflows } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('id, name');
      if (error) throw error;
      return data;
    }
  });

  const { data: servers } = useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servers')
        .select('id, name');
      if (error) throw error;
      return data;
    }
  });

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const resources = [
        ...selectedWorkflows.map(id => ({
          team_id: team.id,
          resource_type: 'workflow',
          resource_id: id
        })),
        ...selectedServers.map(id => ({
          team_id: team.id,
          resource_type: 'server',
          resource_id: id
        }))
      ];

      if (resources.length === 0) {
        toast.error('Please select at least one resource to share');
        return;
      }

      const { error } = await supabase
        .from('shared_resources')
        .insert(resources);

      if (error) throw error;

      toast.success('Resources shared successfully');
      onResourcesShared();
      onOpenChange(false);
      setSelectedWorkflows([]);
      setSelectedServers([]);
    } catch (error) {
      toast.error('Failed to share resources');
      console.error('Error sharing resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Resources with Team</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="workflows">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="servers">Servers</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="mt-4 space-y-4">
            {workflows?.map((workflow) => (
              <div key={workflow.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`workflow-${workflow.id}`}
                  checked={selectedWorkflows.includes(workflow.id)}
                  onCheckedChange={(checked) => {
                    setSelectedWorkflows(prev =>
                      checked
                        ? [...prev, workflow.id]
                        : prev.filter(id => id !== workflow.id)
                    );
                  }}
                />
                <Label htmlFor={`workflow-${workflow.id}`}>{workflow.name}</Label>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="servers" className="mt-4 space-y-4">
            {servers?.map((server) => (
              <div key={server.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`server-${server.id}`}
                  checked={selectedServers.includes(server.id)}
                  onCheckedChange={(checked) => {
                    setSelectedServers(prev =>
                      checked
                        ? [...prev, server.id]
                        : prev.filter(id => id !== server.id)
                    );
                  }}
                />
                <Label htmlFor={`server-${server.id}`}>{server.name}</Label>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={isLoading || (selectedWorkflows.length === 0 && selectedServers.length === 0)}
          >
            {isLoading ? 'Sharing...' : 'Share Resources'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
