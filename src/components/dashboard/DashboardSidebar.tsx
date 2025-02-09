
import { 
  LayoutDashboard, 
  Plus, 
  List,
  Settings 
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  onNewWorkflow: () => void;
}

const items = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard"
  },
  {
    title: "Workflows",
    icon: List,
    url: "/dashboard"
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings"
  }
];

export function DashboardSidebar({ onNewWorkflow }: DashboardSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onNewWorkflow} className="flex items-center gap-2 w-full">
                  <Plus className="h-4 w-4" />
                  <span>New Workflow</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
