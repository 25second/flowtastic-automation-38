
import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { BrowserSettings } from "@/components/settings/BrowserSettings";
import { MessengersSettings } from "@/components/settings/MessengersSettings";
import { OtherSettings } from "@/components/settings/OtherSettings";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { applyAccentColor } from "@/utils/colorUtils";
import { useAccentColor } from '@/hooks/useAccentColor';
import { SettingsCategories } from "@/components/settings/SettingsCategories";

export default function Settings() {
  const [port, setPort] = useState<string>("");
  const [debugPorts, setDebugPorts] = useState<string>("");
  const [telegramToken, setTelegramToken] = useState<string>("");
  const [slackToken, setSlackToken] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [accentColor, setAccentColor] = useState<string>("#9b87f5");
  const [language, setLanguage] = useState<string>("en");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("general");

  // Apply accent color
  useAccentColor();

  useEffect(() => {
    const savedPort = localStorage.getItem("linkenSpherePort");
    const savedDebugPorts = localStorage.getItem("chromeDebugPorts");
    const savedToken = localStorage.getItem("telegramToken");
    const savedSlackToken = localStorage.getItem("slackToken");
    const savedCaptchaToken = localStorage.getItem("captchaToken");
    const savedLanguage = localStorage.getItem("language");
    const savedAccentColor = localStorage.getItem("accentColor");

    if (savedPort) setPort(savedPort);
    if (savedDebugPorts) setDebugPorts(savedDebugPorts);
    if (savedToken) setTelegramToken(savedToken);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedSlackToken) setSlackToken(savedSlackToken);
    if (savedCaptchaToken) setCaptchaToken(savedCaptchaToken);
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
      applyAccentColor(savedAccentColor);
    } else {
      applyAccentColor("#9b87f5");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("accentColor", accentColor);
    applyAccentColor(accentColor);
  }, [accentColor]);

  const handleSave = () => {
    localStorage.setItem("linkenSpherePort", port);
    localStorage.setItem("chromeDebugPorts", debugPorts);
    localStorage.setItem("telegramToken", telegramToken);
    localStorage.setItem("slackToken", slackToken);
    localStorage.setItem("captchaToken", captchaToken);
    localStorage.setItem("language", language);
    localStorage.setItem("accentColor", accentColor);
    toast.success("Settings saved");
  };

  // Define our categories
  const categories = [
    { id: "general", name: "General" },
    { id: "browser", name: "Browser" },
    { id: "messengers", name: "Messengers" },
    { id: "other", name: "Other" }
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <main className="flex-1 w-full h-full overflow-y-auto">
          <div className="container mx-auto py-8 space-y-6">
            <SettingsHeader onSave={handleSave} />
            
            <SettingsCategories
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <div className="card bg-white shadow-sm rounded-lg p-6">
              {selectedCategory === "general" && (
                <GeneralSettings
                  language={language}
                  setLanguage={setLanguage}
                  theme="light"
                  setTheme={() => {}}
                  accentColor={accentColor}
                  setAccentColor={setAccentColor}
                />
              )}

              {selectedCategory === "browser" && (
                <BrowserSettings
                  port={port}
                  setPort={setPort}
                  debugPorts={debugPorts}
                  setDebugPorts={setDebugPorts}
                />
              )}

              {selectedCategory === "messengers" && (
                <MessengersSettings
                  telegramToken={telegramToken}
                  setTelegramToken={setTelegramToken}
                  slackToken={slackToken}
                  setSlackToken={setSlackToken}
                />
              )}

              {selectedCategory === "other" && (
                <OtherSettings
                  captchaToken={captchaToken}
                  setCaptchaToken={setCaptchaToken}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
