
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { Home, Settings, Database, Server } from "lucide-react";

export function DashboardSidebar({ onNewWorkflow }: { onNewWorkflow: () => void }) {
  const navigate = useNavigate();
  const { session } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        {session?.user && (
          <div className="flex flex-col gap-1 px-4 py-2 mb-2 rounded-md bg-sidebar-accent/50">
            <span className="text-sm font-medium">{session.user.email}</span>
            <span className="text-xs text-muted-foreground">Авторизован</span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <Command>
          <CommandInput placeholder="Поиск..." />
          <CommandList>
            <CommandEmpty>Ничего не найдено.</CommandEmpty>
            <CommandGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      href="/"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-sidebar-accent transition-colors",
                        window.location.pathname === "/" && "bg-sidebar-accent"
                      )}
                    >
                      <Home className="w-4 h-4" />
                      <span>Главная</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      href="/tables"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-sidebar-accent transition-colors",
                        window.location.pathname === "/tables" && "bg-sidebar-accent"
                      )}
                    >
                      <Database className="w-4 h-4" />
                      <span>Таблицы</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      href="/servers"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-sidebar-accent transition-colors",
                        window.location.pathname === "/servers" && "bg-sidebar-accent"
                      )}
                    >
                      <Server className="w-4 h-4" />
                      <span>Серверы</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      href="/settings"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-sidebar-accent transition-colors",
                        window.location.pathname === "/settings" && "bg-sidebar-accent"
                      )}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Настройки</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </CommandGroup>
          </CommandList>
        </Command>
      </SidebarContent>
    </Sidebar>
  );
}
