
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { DynamicIcon } from "@/components/flow/node-components/DynamicIcon";
import { useEffect, useState } from "react";

interface MenuItemProps {
  title: string;
  icon: LucideIcon;
  url: string;
  disabled?: boolean;
  isActive?: boolean;
  secondaryIcon?: LucideIcon;
}

export function MenuItem({ 
  title, 
  icon, 
  url, 
  disabled = false, 
  isActive = false,
  secondaryIcon
}: MenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Add hover state handler
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  return (
    <SidebarMenuItem>
      <Link
        to={disabled ? "#" : url}
        className={cn(
          buttonVariants({ 
            variant: isActive ? "sidebar" : "sidebar-ghost", 
            size: "sm" 
          }),
          "w-full justify-start",
          disabled && "opacity-50 cursor-not-allowed",
          "relative" // Added for positioning the secondary icon
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <DynamicIcon icon={icon} className="mr-2 h-4 w-4" />
        <span className="flex-1 truncate">{title}</span>
        
        {secondaryIcon && (
          <div className={cn(
            "transition-all duration-300",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-0",
            isActive ? "animate-pulse" : ""
          )}>
            <DynamicIcon 
              icon={secondaryIcon} 
              className={cn(
                "h-4 w-4 text-[#9b87f5]",
                isHovered && "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
              )} 
            />
          </div>
        )}
      </Link>
    </SidebarMenuItem>
  );
}
