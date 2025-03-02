
import { Dashboard, Users, Percent, CreditCard, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarHeader } from "@/components/ui/sidebar";
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MenuItem } from '../dashboard/sidebar/MenuItem';
import { ProfileSection } from '../dashboard/sidebar/ProfileSection';
import { SignOutButton } from '../dashboard/sidebar/SignOutButton';
import { useTheme } from 'next-themes';

const adminItems = [{
  title: "Dashboard",
  icon: Dashboard,
  url: "/app/admin",
  disabled: false
}, {
  title: "Users",
  icon: Users,
  url: "/app/admin/users",
  disabled: false
}, {
  title: "Promo Codes",
  icon: Percent,
  url: "/app/admin/promocodes",
  disabled: false
}, {
  title: "Plans",
  icon: Settings,
  url: "/app/admin/plans",
  disabled: false
}, {
  title: "Payments",
  icon: CreditCard,
  url: "/app/admin/payments",
  disabled: false
}];

export function AdminSidebar() {
  const { session } = useAuth();
  const userEmail = session?.user?.email;
  const location = useLocation();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleImageLoad = () => {
    setLogoLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Error loading logo:', e);
    setLogoLoaded(false);
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
        <Link to="/app/admin" className="flex items-center justify-center">
          <div className="flex items-center">
            <img 
              key={resolvedTheme}
              src={logoUrl}
              alt="Logo" 
              className={`h-8 object-contain transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="eager"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <span className="ml-2 font-semibold text-lg">Admin Panel</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-[calc(100vh-5rem)] justify-between">
        <SidebarGroup>
          <SidebarGroupContent className="px-3 pt-6">
            <SidebarMenu className="space-y-3">
              {adminItems.map(item => (
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
