
import { 
  Workflow, 
  Server, 
  Cookie,
  Table,
  Settings,
  UserRound,
  Languages,
  Plus
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
    title: "Workflows",
    icon: Workflow,
    url: "/dashboard"
  },
  {
    title: "Servers",
    icon: Server,
    url: "/servers"
  },
  {
    title: "Cookie Storage",
    icon: Cookie,
    url: "/cookies"
  },
  {
    title: "Tables",
    icon: Table,
    url: "/tables"
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings"
  },
  {
    title: "My Profile",
    icon: UserRound,
    url: "/profile"
  },
  {
    title: "Language Switcher",
    icon: Languages,
    url: "/language"
  }
];

export function DashboardSidebar({ onNewWorkflow }: DashboardSidebarProps) {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Workflow className="h-10 w-10 text-sidebar-primary" />
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-sidebar-primary to-purple-500 bg-clip-text text-transparent">
              Workflow
            </h2>
            <p className="text-sm text-sidebar-foreground/60">
              Automation Platform
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-3 pt-6">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <a href={item.url} className="flex items-center gap-3 px-4 py-3 rounded-md">
                      <item.icon className="h-5 w-5" />
                      <span className="text-base">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={onNewWorkflow} 
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-md transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-base">New Workflow</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
