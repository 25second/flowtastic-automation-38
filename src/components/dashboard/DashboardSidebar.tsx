import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { LogOut } from "lucide-react";
import { Workflow, Server, Table, Settings, Bot, Bot as BotAI, Users } from 'lucide-react';

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
  title: "Tables",
  icon: Table,
  url: "/tables",
  disabled: false
}, {
  title: "Teams",
  icon: Users,
  url: "/teams",
  disabled: false
}, {
  title: "Settings",
  icon: Settings,
  url: "/settings",
  disabled: false
}];

export function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { setTheme } = useTheme();

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url as string} />
              <AvatarFallback>{user?.user_metadata?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-80">
          <SheetHeader className="text-left">
            <SheetTitle>Profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start px-4 w-full">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user?.user_metadata?.avatar_url as string} />
                  <AvatarFallback>{user?.user_metadata?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user?.user_metadata?.username}</div>
                  <div className="text-muted-foreground text-sm">
                    {user?.email}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="cursor-pointer focus:outline-none"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NavigationMenu className="mt-4">
            <NavigationMenuList>
              {items.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <TooltipProvider>
                    <Tooltip delayDuration={50}>
                      <TooltipTrigger asChild>
                        <Link to={item.url}>
                          <Button variant="ghost" className="justify-start px-4 w-full" disabled={item.disabled}>
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" align="center">
                        {item.disabled ? "Coming Soon!" : item.title}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setTheme(theme => theme === 'dark' ? 'light' : 'dark')
              }}
            >
              Toggle Theme
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
