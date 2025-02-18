import { Workflow, Server, Cookie, Table, Settings, UserRound, Languages, DoorOpen, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

interface DashboardSidebarProps {
  onNewWorkflow: () => void;
}

const items = [{
  title: "Workflows",
  icon: Workflow,
  url: "/dashboard"
}, {
  title: "Servers",
  icon: Server,
  url: "/servers"
}, {
  title: "Cookie Storage",
  icon: Cookie,
  url: "/cookies"
}, {
  title: "Tables",
  icon: Table,
  url: "/tables"
}, {
  title: "Settings",
  icon: Settings,
  url: "/settings"
}];

const languages = [{
  name: "English",
  code: "en"
}, {
  name: "Russian",
  code: "ru"
}, {
  name: "Chinese",
  code: "zh"
}];

export function DashboardSidebar({
  onNewWorkflow
}: DashboardSidebarProps) {
  const { session } = useAuth();
  const userEmail = session?.user?.email;
  const location = useLocation();

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
        <img alt="Logo" className="w-full object-contain" src="/lovable-uploads/3645a23d-e372-4b20-8f11-903eb0a14a8e.png" />
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-[calc(100vh-5rem)] justify-between">
        <SidebarGroup>
          <SidebarGroupContent className="px-3 pt-6">
            <SidebarMenu className="space-y-3">
              {items.map(item => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url} 
                        className={`flex items-center gap-4 px-5 rounded-md py-6 transition-all duration-300 hover:scale-105 group relative overflow-hidden
                          ${isActive 
                            ? 'bg-gradient-to-br from-[#9b87f5] to-[#8B5CF6] text-white shadow-lg shadow-purple-500/25' 
                            : 'hover:bg-gradient-to-br hover:from-[#9b87f5] hover:to-[#8B5CF6] hover:text-white'}`}
                      >
                        <div className="relative z-10 transition-transform duration-200 group-hover:rotate-12">
                          <item.icon className="h-6 w-6" />
                        </div>
                        <span className="relative z-10 text-[15px] font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="px-3 pb-6">
            <SidebarMenu className="space-y-3">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-4 rounded-md px-5 py-6 transition-all duration-300 hover:scale-105 group relative overflow-hidden hover:bg-gradient-to-br hover:from-[#9b87f5] hover:to-[#8B5CF6] hover:text-white"
                  >
                    <div className="relative z-10 transition-transform duration-200 group-hover:rotate-12">
                      <UserRound className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <span className="relative z-10 text-[15px] font-medium">My Profile</span>
                      {userEmail && <span className="text-xs text-muted-foreground group-hover:text-white/70">{userEmail}</span>}
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-4 w-full px-5 py-6 rounded-md transition-all duration-300 hover:scale-105 group relative overflow-hidden hover:bg-gradient-to-br hover:from-[#9b87f5] hover:to-[#8B5CF6] hover:text-white">
                      <div className="relative z-10 transition-transform duration-200 group-hover:rotate-12">
                        <Languages className="h-6 w-6" />
                      </div>
                      <span className="relative z-10 text-[15px] font-medium">Language</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    {languages.map(lang => (
                      <DropdownMenuItem key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button 
                    onClick={handleSignOut} 
                    className="flex items-center gap-4 w-full px-5 py-6 rounded-md transition-all duration-300 hover:scale-105 group relative overflow-hidden hover:bg-gradient-to-br hover:from-[#F97316] hover:to-[#FEC6A1] hover:text-white text-red-500"
                  >
                    <div className="relative z-10 transition-transform duration-200 group-hover:rotate-12">
                      <DoorOpen className="h-6 w-6" />
                    </div>
                    <span className="relative z-10 text-[15px] font-medium">Sign Out</span>
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
