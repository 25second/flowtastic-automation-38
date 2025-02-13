
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
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<string>("en");

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const savedPort = localStorage.getItem("linkenSpherePort");
    const savedToken = localStorage.getItem("telegramToken");
    const savedLanguage = localStorage.getItem("language");

    if (savedPort) setPort(savedPort);
    if (savedToken) setTelegramToken(savedToken);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem("linkenSpherePort", port);
    localStorage.setItem("telegramToken", telegramToken);
    localStorage.setItem("language", language);

    toast.success("Settings saved successfully");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-2xl mx-auto space-y-8">
              <h1 className="text-2xl font-semibold">Settings</h1>

              <div className="space-y-6">
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
