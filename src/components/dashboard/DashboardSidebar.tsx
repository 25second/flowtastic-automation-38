
import { Workflow, Server, Table, Settings, Bot, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarHeader } from "@/components/ui/sidebar";
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MenuItem } from './sidebar/MenuItem';
import { ProfileSection } from './sidebar/ProfileSection';
import { SignOutButton } from './sidebar/SignOutButton';
import { useTheme } from 'next-themes';

interface DashboardSidebarProps {
  onNewWorkflow: () => void;
}

const items = [{
  title: "Bot Launch",
  icon: Bot,
  url: "/bot-launch",
  disabled: false
}, {
  title: "Workflows",
  icon: Workflow,
  url: "/dashboard",
  disabled: false
}, {
  title: "Servers",
  icon: Server,
  url: "/servers",
  disabled: false
}, {
  title: "Tables",
  icon: Table,
  url: "/tables",
  disabled: false
}, {
  title: "Files",
  icon: FolderOpen,
  url: "/files",
  disabled: false
}, {
  title: "Settings",
  icon: Settings,
  url: "/settings",
  disabled: false
}];

export function DashboardSidebar({
  onNewWorkflow
}: DashboardSidebarProps) {
  const { session } = useAuth();
  const userEmail = session?.user?.email;
  const location = useLocation();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  const handleImageLoad = () => {
    setLogoLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Error loading logo:', e);
    setLogoLoaded(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    setLogoLoaded(false);
  }, [resolvedTheme]);

  const logoUrl = resolvedTheme === 'dark'
    ? '/lovable-uploads/66215812-3051-4814-a895-e223e9dee6b3.png'
    : '/lovable-uploads/3645a23d-e372-4b20-8f11-903eb0a14a8e.png';

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center justify-center">
          <img 
            key={resolvedTheme}
            src={logoUrl}
            alt="Logo" 
            className={`w-full h-12 object-contain transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="eager"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-[calc(100vh-5rem)] justify-between">
        <SidebarGroup>
          <SidebarGroupContent className="px-3 pt-6">
            <SidebarMenu className="space-y-3 border-b border-border pb-6 mb-6">
              {items.map(item => (
                <MenuItem
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                  url={item.url}
                  disabled={item.disabled}
                  isActive={location.pathname === item.url}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="px-3 pb-6">
            <SidebarMenu className="space-y-3">
              <ProfileSection
                userEmail={userEmail}
                onSignOut={handleSignOut}
              />
              
              <SignOutButton onSignOut={handleSignOut} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
