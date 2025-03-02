
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader
} from '@/components/ui/sidebar';
import { 
  BookOpen, 
  FolderGit2, 
  LayoutDashboard, 
  ListChecks, 
  Play, 
  Plus, 
  Settings 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const WorkflowSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'All Workflows',
      icon: ListChecks,
      url: '/workflows',
      disabled: false,
    },
    {
      title: 'Create Workflow',
      icon: Plus,
      url: '/workflows/create',
      disabled: false,
    },
    {
      title: 'Categories',
      icon: FolderGit2,
      url: '/workflows/categories',
      disabled: true,
    },
    {
      title: 'Run History',
      icon: Play,
      url: '/workflows/history',
      disabled: true,
    },
    {
      title: 'Templates',
      icon: BookOpen,
      url: '/workflows/templates',
      disabled: true,
    },
    {
      title: 'Settings',
      icon: Settings,
      url: '/workflows/settings',
      disabled: true,
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-3">
        <LayoutDashboard className="h-6 w-6 mr-2" />
        <h2 className="text-xl font-semibold">Workflows</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    {item.disabled ? (
                      <div className="flex items-center gap-2 opacity-50 pointer-events-none">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <div 
                        onClick={() => navigate(item.url)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
