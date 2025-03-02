
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { 
  SidebarMenuButton, 
  SidebarMenuItem as BaseSidebarMenuItem 
} from "@/components/ui/sidebar";

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
      <SidebarMenuButton 
        asChild
        isActive={isActive}
        tooltip={disabled ? `${title} (Coming soon)` : title}
      >
        {disabled ? (
          <div className="flex items-center gap-4 px-3 py-2 cursor-not-allowed opacity-50">
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{title}</span>
          </div>
        ) : (
          <Link 
            to={url} 
            className="flex items-center gap-4 px-3 py-2"
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{title}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  );
}
