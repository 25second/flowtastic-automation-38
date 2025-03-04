
import { LayoutDashboard, Workflow, Settings, Bot, Table, Cpu } from 'lucide-react';
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
  title: "Dashboard",
  icon: LayoutDashboard,
  url: "/dashboard",
  disabled: false
}, {
  title: "AI Agents",
  icon: Cpu,
  url: "/ai-agents",
  disabled: false
}, {
  title: "Bot Launch",
  icon: Bot,
  url: "/bot-launch",
  disabled: false
}, {
  title: "Workflows",
  icon: Workflow,
  url: "/workflows",
  disabled: false
}, {
  title: "Tables",
  icon: Table,
  url: "/tables",
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is an admin (in a real app, you would check user roles)
    // For this example, we'll assume all authenticated users can access the admin panel
    if (session?.user?.id) {
      setIsAdmin(true);
    }
  }, [session]);

  const handleImageLoad = () => {
    setLogoLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Error loading logo:', e);
    setLogoLoaded(false);
  };

  // Add back the handleSignOut function that was removed
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
            <SidebarMenu className="space-y-3">
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
