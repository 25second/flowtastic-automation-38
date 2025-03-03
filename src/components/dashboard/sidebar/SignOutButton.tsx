
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
          className="flex items-center gap-4 w-full px-5 py-6 rounded-md transition-all duration-300 hover:scale-105 group relative overflow-hidden hover:bg-gradient-to-br hover:from-[#ea384c] hover:to-[#ff6b6b] hover:text-white text-red-500"
        >
          <div className="relative z-10 transition-transform duration-200 group-hover:rotate-12">
            <DoorOpen className="h-6 w-6" />
          </div>
          <span className="relative z-10 text-[15px] font-medium">Sign Out</span>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
