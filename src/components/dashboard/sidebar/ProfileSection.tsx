
import { UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface ProfileSectionProps {
  userEmail?: string | null;
  onSignOut: () => void;
}

export function ProfileSection({
  userEmail,
  onSignOut
}: ProfileSectionProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to="/profile" className="flex items-center gap-4 rounded-md px-5 py-3">
          <div className="relative z-10">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="flex flex-col items-start">
            <span className="relative z-10 text-[15px] font-medium">My Profile</span>
            {userEmail && <span className="text-xs text-muted-foreground">{userEmail}</span>}
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
