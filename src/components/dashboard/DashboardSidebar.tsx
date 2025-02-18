
import { Workflow, Server, Cookie, Table, Settings, UserRound, Languages, DoorOpen, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

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
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="transition-all duration-300 hover:bg-[#0a68ff]/10 hover:text-[#0a68ff] group relative overflow-hidden">
                    <Link to={item.url} className="flex items-center gap-3 px-4 rounded-md py-[12px]">
                      {/* Background animation */}
                      <div className="absolute inset-0 bg-[#0a68ff]/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                      
                      {/* Icon with animations */}
                      <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]">
                        <item.icon className="h-5 w-5 transition-colors duration-300 group-hover:text-[#0a68ff]" />
                      </div>
                      
                      {/* Text with animations */}
                      <span className="relative z-10 text-base transition-all duration-300 group-hover:translate-x-1 group-hover:font-medium group-hover:text-[#0a68ff] after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-[#0a68ff] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-left">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="px-3 pb-6">
            <SidebarMenu className="mx-0 my-0">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="transition-all duration-300 hover:bg-[#0a68ff]/10 hover:text-[#0a68ff] group relative overflow-hidden">
                  <Link to="/profile" className="flex items-center gap-3 rounded-md px-[16px] mx-0 my-0 py-[25px]">
                    {/* Background animation */}
                    <div className="absolute inset-0 bg-[#0a68ff]/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                    
                    {/* Icon with animations */}
                    <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]">
                      <UserRound className="h-5 w-5 transition-colors duration-300 group-hover:text-[#0a68ff]" />
                    </div>
                    
                    <div className="flex flex-col items-start gap-1 mx-0 my-0 py-0 relative z-10">
                      <span className="text-base transition-all duration-300 group-hover:translate-x-1 group-hover:font-medium group-hover:text-[#0a68ff]">My Profile</span>
                      {userEmail && <span className="text-xs text-muted-foreground group-hover:text-[#0a68ff]/70">{userEmail}</span>}
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all duration-300 hover:bg-[#0a68ff]/10 hover:text-[#0a68ff] group relative overflow-hidden">
                      {/* Background animation */}
                      <div className="absolute inset-0 bg-[#0a68ff]/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                      
                      {/* Icon with animations */}
                      <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]">
                        <Languages className="h-5 w-5 transition-colors duration-300 group-hover:text-[#0a68ff]" />
                      </div>
                      
                      <span className="relative z-10 text-base transition-all duration-300 group-hover:translate-x-1 group-hover:font-medium group-hover:text-[#0a68ff]">Language</span>
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
                <SidebarMenuButton asChild className="w-full transition-all duration-300 hover:bg-red-500/10 group relative overflow-hidden">
                  <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 rounded-md text-red-500 hover:text-red-600 transition-colors w-full">
                    {/* Background animation */}
                    <div className="absolute inset-0 bg-red-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                    
                    {/* Icon with animations */}
                    <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]">
                      <DoorOpen className="h-5 w-5 transition-transform duration-200" />
                    </div>
                    
                    <span className="relative z-10 text-base transition-all duration-300 group-hover:translate-x-1 group-hover:font-medium">Sign Out</span>
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
