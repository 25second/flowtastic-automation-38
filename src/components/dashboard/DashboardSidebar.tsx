import { Workflow, Server, Cookie, Table, Settings, Bot, Bot as BotAI } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarHeader } from "@/components/ui/sidebar";
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MenuItem } from './sidebar/MenuItem';
import { LanguageSelector } from './sidebar/LanguageSelector';
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
  title: "AI Agents",
  icon: BotAI,
  url: "/ai-agents",
  disabled: true
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
  title: "Cookie Storage",
  icon: Cookie,
  url: "/cookies",
  disabled: true
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

const languages = [{
  name: "English",
  code: "en",
  flag: "🇬🇧"
}, {
  name: "Russian",
  code: "ru",
  flag: "🇷🇺"
}, {
  name: "Chinese",
  code: "zh",
  flag: "🇨🇳"
}];

export function DashboardSidebar({
  onNewWorkflow
}: DashboardSidebarProps) {
  const { session } = useAuth();
  const userEmail = session?.user?.email;
  const location = useLocation();
  const [selectedLang, setSelectedLang] = useState('en');
  const [logoLoaded, setLogoLoaded] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleImageLoad = () => {
    setLogoLoaded(true);
    console.log('Logo loaded successfully');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Error loading logo:', e);
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const logoUrl = resolvedTheme === 'dark'
    ? '/lovable-uploads/66215812-3051-4814-a895-e223e9dee6b3.png'
    : '/lovable-uploads/3645a23d-e372-4b20-8f11-903eb0a14a8e.png';

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <Link to="/dashboard" className="block">
          <img 
            src={logoUrl}
            alt="Logo" 
            className={`w-full h-8 object-contain transition-opacity duration-200 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
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
              
              <LanguageSelector
                languages={languages}
                selectedLang={selectedLang}
                onLanguageChange={handleLanguageChange}
              />

              <SignOutButton onSignOut={handleSignOut} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
