
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CreateTeamDialog } from '@/components/teams/CreateTeamDialog';
import { TeamsList } from '@/components/teams/TeamsList';
import { toast } from 'sonner';

export default function Teams() {
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  const { data: teams, isLoading, error, refetch } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          team_members(*),
          shared_resources(*)
        `);

      if (error) throw error;
      return data;
    }
  });

  if (error) {
    toast.error('Failed to load teams');
  }

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Button onClick={() => setIsCreateTeamOpen(true)} className="gap-2">
          <PlusCircle className="h-5 w-5" />
          New Team
        </Button>
      </div>

      <TeamsList 
        teams={teams || []} 
        isLoading={isLoading} 
        onTeamUpdated={() => refetch()}
      />

      <CreateTeamDialog
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
        onTeamCreated={() => {
          refetch();
          setIsCreateTeamOpen(false);
        }}
      />
    </div>
  );
}
