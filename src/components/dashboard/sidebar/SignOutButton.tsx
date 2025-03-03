
import { DoorOpen } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface SignOutButtonProps {
  onSignOut: () => void;
}

export function SignOutButton({ onSignOut }: SignOutButtonProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <button 
          onClick={onSignOut} 
          className="flex items-center gap-4 w-full px-5 py-3 rounded-md transition-colors text-red-500"
        >
          <div className="relative z-10">
            <DoorOpen className="h-5 w-5" />
          </div>
          <span className="relative z-10 text-[15px]">Sign Out</span>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
