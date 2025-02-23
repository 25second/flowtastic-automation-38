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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";

const accentColors = [
  { value: "#9b87f5" },
  { value: "#7E69AB" },
  { value: "#6E59A5" },
  { value: "#8B5CF6" },
  { value: "#D946EF" },
  { value: "#F97316" },
  { value: "#0EA5E9" },
  { value: "#EF4444" },
  { value: "#10B981" },
  { value: "#6366F1" },
  { value: "#8B5CF6" },
  { value: "#EC4899" },
  { value: "#F59E0B" },
  { value: "#3B82F6" },
  { value: "#14B8A6" },
  { value: "#F43F5E" }
];

const hexToHSL = (hex: string) => {
  hex = hex.replace('#', '');
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

const applyAccentColor = (color: string) => {
  const hsl = hexToHSL(color);
  const darkerHsl = { ...hsl, l: Math.max(0, hsl.l - 10) };
  
  document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
  document.documentElement.style.setProperty('--ring', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
  document.documentElement.style.setProperty('--primary-darker', `${hsl.h} ${hsl.s}% ${darkerHsl.l}%`);

  document.documentElement.style.setProperty('--sidebar-accent', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
  
  document.documentElement.style.setProperty('--sidebar-accent-foreground', '0 0% 100%');
};

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
    }
  }, []);

  useEffect(() => {
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

    applyAccentColor(accentColor);
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
              <div className="border-b">
                <div className="container flex-1 items-center space-y-4 py-4 sm:flex sm:space-y-0 sm:space-x-4 md:py-6">
                  <h1 className="text-2xl font-bold tracking-tight">Настройки</h1>
                </div>
              </div>
              
              <div className="container max-w-5xl space-y-6">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">Общие</TabsTrigger>
                    <TabsTrigger value="browser">Браузер</TabsTrigger>
                    <TabsTrigger value="messengers">Мессенджеры</TabsTrigger>
                    <TabsTrigger value="other">Прочее</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Язык интерфейса</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите язык" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ru">Русский</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Цветовая схема</Label>
                        <Select value={theme} onValueChange={setTheme}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тему" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Светлая</SelectItem>
                            <SelectItem value="dark">Тёмная</SelectItem>
                            <SelectItem value="system">Системная</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Акцентный цвет</Label>
                        <div className="grid grid-cols-8 gap-2 p-1">
                          {accentColors.map((color) => (
                            <button
                              key={color.value}
                              className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ring-offset-2 ${
                                accentColor === color.value ? 'ring-2 ring-primary' : ''
                              }`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => setAccentColor(color.value)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="browser" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="port">API порт Linken Sphere</Label>
                        <Input
                          id="port"
                          type="number"
                          placeholder="Введите порт"
                          value={port}
                          onChange={(e) => setPort(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="debugPorts">Chrome Debug порты</Label>
                        <Textarea
                          id="debugPorts"
                          placeholder="Введите порты через запятую (например: 9222,9223,9224)"
                          value={debugPorts}
                          onChange={(e) => setDebugPorts(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Укажите порты через запятую для отладки Chrome
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="messengers" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="telegram">Telegram Bot Token</Label>
                        <Input
                          id="telegram"
                          type="password"
                          placeholder="Введите токен бота"
                          value={telegramToken}
                          onChange={(e) => setTelegramToken(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slack">Slack API Token</Label>
                        <Input
                          id="slack"
                          type="password"
                          placeholder="Введите API токен"
                          value={slackToken}
                          onChange={(e) => setSlackToken(e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="other" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="captcha">2captcha API Key</Label>
                        <Input
                          id="captcha"
                          type="password"
                          placeholder="Введите API ключ"
                          value={captchaToken}
                          onChange={(e) => setCaptchaToken(e.target.value)}
                        />
                      </div>
                    </div>
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
