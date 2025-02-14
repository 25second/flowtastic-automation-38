
import { 
  Workflow, 
  Server, 
  Cookie,
  Table,
  Settings,
  UserRound,
  Languages,
  DoorOpen,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

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
  }
];

const languages = [
  { name: "English", code: "en" },
  { name: "Russian", code: "ru" },
  { name: "Chinese", code: "zh" }
];

export function DashboardSidebar({ onNewWorkflow }: DashboardSidebarProps) {
  const { session } = useAuth();
  const userEmail = session?.user?.email;

  const handleLanguageChange = (langCode: string) => {
    console.log('Language changed to:', langCode);
    // Here you can implement the language change logic
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <img 
          src="/lovable-uploads/f54d723c-ee3c-4e32-9ec1-dcf84513c3df.png"
          alt="Logo"
          className="w-full object-contain"
        />
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-[calc(100vh-5rem)] justify-between">
        <SidebarGroup>
          <SidebarGroupContent className="px-3 pt-6">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-4 py-3 rounded-md">
                      <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                      <span className="text-base transition-transform duration-200 group-hover:translate-x-1">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="px-3 pb-6">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className="transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group w-full"
                >
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-md">
                    <UserRound className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                    <div className="flex flex-col items-start">
                      <span className="text-base transition-transform duration-200 group-hover:translate-x-1">My Profile</span>
                      {userEmail && (
                        <span className="text-xs text-muted-foreground pl-0.5">{userEmail}</span>
                      )}
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group">
                      <Languages className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                      <span className="text-base transition-transform duration-200 group-hover:translate-x-1">Language</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    {languages.map((lang) => (
                      <DropdownMenuItem 
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                      >
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className="w-full transition-all duration-200 hover:bg-red-500/10 group"
                >
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-md text-red-500 hover:text-red-600 transition-colors w-full"
                  >
                    <DoorOpen className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-base transition-transform duration-200 group-hover:translate-x-1">Sign Out</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
