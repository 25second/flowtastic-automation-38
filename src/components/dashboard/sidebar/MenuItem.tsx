
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
          <div className="flex items-center gap-4 px-5 rounded-md py-3 cursor-not-allowed opacity-50 line-through">
            <div className="relative z-10">
              <Icon className="h-5 w-5" />
            </div>
            <span className="relative z-10 text-[15px] font-medium">
              {title}
            </span>
          </div>
        ) : (
          <Link 
            to={url} 
            className={`flex items-center gap-4 px-5 rounded-md py-3 transition-colors
              ${isActive 
                ? 'bg-emerald-500 text-white font-medium' 
                : 'hover:bg-gray-100'}`}
          >
            <div className="relative z-10">
              <Icon className="h-5 w-5" />
            </div>
            <span className="relative z-10 text-[15px]">
              {title}
            </span>
          </Link>
        )}
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  );
}
