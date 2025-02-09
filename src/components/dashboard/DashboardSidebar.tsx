
import { 
  LayoutDashboard, 
  Plus, 
  List,
  Settings,
  Workflow
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
  SidebarHeader,
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
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Workflow className="h-8 w-8 text-sidebar-primary" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-sidebar-primary to-purple-500 bg-clip-text text-transparent">
              Workflow
            </h2>
            <p className="text-xs text-sidebar-foreground/60">
              Automation Platform
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-sidebar-foreground/70">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <a href={item.url} className="flex items-center gap-2 px-2 py-1.5 rounded-md">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={onNewWorkflow} 
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">New Workflow</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
