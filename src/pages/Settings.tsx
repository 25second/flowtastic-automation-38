
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { BrowserSettings } from "@/components/settings/BrowserSettings";
import { MessengersSettings } from "@/components/settings/MessengersSettings";
import { OtherSettings } from "@/components/settings/OtherSettings";
import { applyAccentColor } from "@/utils/colorUtils";

export default function Settings() {
  const [port, setPort] = useState<string>("");
  const [debugPorts, setDebugPorts] = useState<string>("");
  const [telegramToken, setTelegramToken] = useState<string>("");
  const [slackToken, setSlackToken] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [accentColor, setAccentColor] = useState<string>("#9b87f5");
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<string>("en");

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
    toast.success("Настройки сохранены");
  };

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1">
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <DashboardHeader />
            <div className="flex-1 space-y-4">
              <div className="border-b"></div>
              <div className="w-full px-4 space-y-6">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">Общие</TabsTrigger>
                    <TabsTrigger value="browser">Браузер</TabsTrigger>
                    <TabsTrigger value="messengers">Мессенджеры</TabsTrigger>
                    <TabsTrigger value="other">Прочее</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-6">
                    <GeneralSettings
                      language={language}
                      setLanguage={setLanguage}
                      theme={theme}
                      setTheme={setTheme}
                      accentColor={accentColor}
                      setAccentColor={setAccentColor}
                    />
                  </TabsContent>

                  <TabsContent value="browser" className="space-y-6">
                    <BrowserSettings
                      port={port}
                      setPort={setPort}
                      debugPorts={debugPorts}
                      setDebugPorts={setDebugPorts}
                    />
                  </TabsContent>

                  <TabsContent value="messengers" className="space-y-6">
                    <MessengersSettings
                      telegramToken={telegramToken}
                      setTelegramToken={setTelegramToken}
                      slackToken={slackToken}
                      setSlackToken={setSlackToken}
                    />
                  </TabsContent>

                  <TabsContent value="other" className="space-y-6">
                    <OtherSettings
                      captchaToken={captchaToken}
                      setCaptchaToken={setCaptchaToken}
                    />
                  </TabsContent>
                </Tabs>

                <Button onClick={handleSave} className="w-full">
                  Сохранить настройки
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
