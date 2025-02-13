
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Settings() {
  const [port, setPort] = useState<string>("");
  const [telegramToken, setTelegramToken] = useState<string>("");
  const [nebiusKey, setNebiusKey] = useState<string>("");
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    const savedPort = localStorage.getItem("linkenSpherePort");
    const savedToken = localStorage.getItem("telegramToken");
    const savedLanguage = localStorage.getItem("language");
    const savedNebiusKey = localStorage.getItem("nebiusKey");

    if (savedPort) setPort(savedPort);
    if (savedToken) setTelegramToken(savedToken);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedNebiusKey) setNebiusKey(savedNebiusKey);
  }, []);

  const handleSave = () => {
    localStorage.setItem("linkenSpherePort", port);
    localStorage.setItem("telegramToken", telegramToken);
    localStorage.setItem("language", language);
    localStorage.setItem("nebiusKey", nebiusKey);

    toast.success("Settings saved successfully");
  };

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1">
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <DashboardHeader />
            <div className="flex-1 space-y-4">
              <div className="border-b">
                <div className="container flex-1 items-center space-y-4 py-4 sm:flex sm:space-y-0 sm:space-x-4 md:py-6">
                  <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                </div>
              </div>
              <div className="container space-y-8 max-w-5xl">
                <div className="space-y-6">
                  {/* Nebius API Key */}
                  <div className="space-y-2">
                    <Label htmlFor="nebius">Nebius API Key</Label>
                    <Input
                      id="nebius"
                      type="password"
                      placeholder="Enter Nebius API key"
                      value={nebiusKey}
                      onChange={(e) => setNebiusKey(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter your Nebius API key for AI flow generation
                    </p>
                  </div>

                  {/* Linken Sphere Port */}
                  <div className="space-y-2">
                    <Label htmlFor="port">Linken Sphere API Port</Label>
                    <Input
                      id="port"
                      type="number"
                      placeholder="Enter port number"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Specify the port number for the Linken Sphere API connection
                    </p>
                  </div>

                  {/* Language Selection */}
                  <div className="space-y-2">
                    <Label>Display Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ru">Russian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark theme
                      </p>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                  </div>

                  {/* Telegram Bot Token */}
                  <div className="space-y-2">
                    <Label htmlFor="telegram">Telegram Bot Token</Label>
                    <Input
                      id="telegram"
                      type="password"
                      placeholder="Enter Telegram bot token"
                      value={telegramToken}
                      onChange={(e) => setTelegramToken(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter your Telegram bot token for notifications
                    </p>
                  </div>

                  {/* Save Button */}
                  <Button onClick={handleSave} className="w-full">
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
