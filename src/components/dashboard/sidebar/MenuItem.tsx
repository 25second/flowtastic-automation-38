
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { SidebarMenuButton, SidebarMenuItem as BaseSidebarMenuItem } from "@/components/ui/sidebar";

interface MenuItemProps {
  title: string;
  icon: LucideIcon;
  url: string;
  disabled: boolean;
  isActive: boolean;
}

export function MenuItem({ title, icon: Icon, url, disabled, isActive }: MenuItemProps) {
  return (
    <BaseSidebarMenuItem>
      <SidebarMenuButton asChild>
        {disabled ? (
          <div className="flex items-center gap-4 px-5 rounded-md py-6 cursor-not-allowed opacity-50 line-through">
            <div className="relative z-10">
              <Icon className="h-6 w-6" />
            </div>
            <span className="relative z-10 text-[15px] font-medium">
              {title}
            </span>
          </div>
        ) : (
          <Link 
            to={url} 
            className={`flex items-center gap-4 px-5 rounded-md py-6 transition-all duration-300 hover:scale-105 group relative overflow-hidden
              ${isActive 
                ? 'bg-gradient-to-br from-[#9b87f5] to-[#8B5CF6] text-white shadow-lg shadow-purple-500/25' 
                : 'hover:bg-gradient-to-br hover:from-[#9b87f5] hover:to-[#8B5CF6] hover:text-white'}`}
          >
            <div className="relative z-10 transition-transform duration-200 group-hover:rotate-12">
              <Icon className="h-6 w-6" />
            </div>
            <span className="relative z-10 text-[15px] font-medium">
              {title}
            </span>
          </Link>
        )}
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  );
}
