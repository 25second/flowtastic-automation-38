
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Share2 } from 'lucide-react';
import { ShareResourcesDialog } from './ShareResourcesDialog';
import { AddTeamMemberDialog } from './AddTeamMemberDialog';
import { Skeleton } from '@/components/ui/skeleton';

interface Team {
  id: string;
  name: string;
  team_members: any[];
  shared_resources: any[];
}

interface TeamsListProps {
  teams: Team[];
  isLoading: boolean;
  onTeamUpdated: () => void;
}

export function TeamsList({ teams, isLoading, onTeamUpdated }: TeamsListProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isShareResourcesOpen, setIsShareResourcesOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!teams.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No teams created yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>
                {team.team_members.length} members · {team.shared_resources.length} shared resources
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  setSelectedTeam(team);
                  setIsAddMemberOpen(true);
                }}
              >
                <UserPlus className="h-4 w-4" />
                Add Member
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  setSelectedTeam(team);
                  setIsShareResourcesOpen(true);
                }}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTeam && (
        <>
          <AddTeamMemberDialog
            team={selectedTeam}
            open={isAddMemberOpen}
            onOpenChange={setIsAddMemberOpen}
            onMemberAdded={onTeamUpdated}
          />
          <ShareResourcesDialog
            team={selectedTeam}
            open={isShareResourcesOpen}
            onOpenChange={setIsShareResourcesOpen}
            onResourcesShared={onTeamUpdated}
          />
        </>
      )}
    </>
  );
}
