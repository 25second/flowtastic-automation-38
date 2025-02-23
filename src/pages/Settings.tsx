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
  { name: "Фиолетовый", value: "#9b87f5", class: "bg-[#9b87f5]" },
  { name: "Лавандовый", value: "#7E69AB", class: "bg-[#7E69AB]" },
  { name: "Индиго", value: "#6E59A5", class: "bg-[#6E59A5]" },
  { name: "Тёмный индиго", value: "#1A1F2C", class: "bg-[#1A1F2C]" },
  { name: "Сиреневый", value: "#D6BCFA", class: "bg-[#D6BCFA]" },
  { name: "Мятный", value: "#F2FCE2", class: "bg-[#F2FCE2]" },
  { name: "Янтарный", value: "#FEF7CD", class: "bg-[#FEF7CD]" },
  { name: "Персиковый", value: "#FEC6A1", class: "bg-[#FEC6A1]" },
  { name: "Нежно-фиолетовый", value: "#E5DEFF", class: "bg-[#E5DEFF]" },
  { name: "Розовый", value: "#FFDEE2", class: "bg-[#FFDEE2]" },
  { name: "Коралловый", value: "#FDE1D3", class: "bg-[#FDE1D3]" },
  { name: "Голубой", value: "#D3E4FD", class: "bg-[#D3E4FD]" },
  { name: "Яркий фиолетовый", value: "#8B5CF6", class: "bg-[#8B5CF6]" },
  { name: "Маджента", value: "#D946EF", class: "bg-[#D946EF]" },
  { name: "Оранжевый", value: "#F97316", class: "bg-[#F97316]" },
  { name: "Синий", value: "#0EA5E9", class: "bg-[#0EA5E9]" },
];

export default function Settings() {
  const [port, setPort] = useState<string>("");
  const [debugPorts, setDebugPorts] = useState<string>("");
  const [telegramToken, setTelegramToken] = useState<string>("");
  const [slackToken, setSlackToken] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [accentColor, setAccentColor] = useState<string>("blue");
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
    if (savedAccentColor) setAccentColor(savedAccentColor);
  }, []);

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

                  {/* Общие настройки */}
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
                        <Select value={accentColor} onValueChange={setAccentColor}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите цвет" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {accentColors.map((color) => (
                              <SelectItem 
                                key={color.value} 
                                value={color.value}
                                className="flex items-center gap-2"
                              >
                                <div 
                                  className={`w-4 h-4 rounded-full ${color.class}`} 
                                />
                                <span>{color.name}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Настройки браузера */}
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

                  {/* Настройки мессенджеров */}
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

                  {/* Прочие настройки */}
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
