
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";

interface ProfileHeaderProps {
  userEmail?: string | null;
}

export const ProfileHeader = ({
  userEmail
}: ProfileHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {userEmail && <span className="text-muted-foreground">{userEmail}</span>}
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline">
          <UserRound className="h-4 w-4 mr-2" />
          View Public Profile
        </Button>
      </div>
    </div>
  );
};
