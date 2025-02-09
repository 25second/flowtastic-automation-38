
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const handleLanguageChange = (langCode: string) => {
    console.log('Language changed to:', langCode);
    // Here you can implement the language change logic
  };

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
      <SidebarContent className="flex flex-col h-[calc(100vh-5rem)] justify-between">
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

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="px-3 pb-6">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className="transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <a href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-md">
                    <UserRound className="h-5 w-5" />
                    <span className="text-base">My Profile</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-md transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                      <Languages className="h-5 w-5" />
                      <span className="text-base">Language</span>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
