import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ru';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Dictionary for translations
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    'app.title': 'Automation Platform',
    'app.settings': 'Settings',
    'app.save': 'Save Settings',
    'app.saved': 'Settings saved',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.workflows': 'Workflows',
    'sidebar.canvas': 'Canvas',
    'sidebar.settings': 'Settings',
    'sidebar.servers': 'Servers',
    'sidebar.botLaunch': 'Bot Launch',
    'sidebar.aiAgents': 'AI Agents',
    'sidebar.tables': 'Tables',
    'sidebar.profile': 'Profile',
    'sidebar.files': 'Files',
    'sidebar.signOut': 'Sign Out',
    
    // Settings page
    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.browser': 'Browser',
    'settings.messengers': 'Messengers',
    'settings.other': 'Other',
    'settings.language': 'Interface Language',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.theme.system': 'System',
    'settings.accentColor': 'Accent Color',
    
    // Browser settings
    'settings.browser.port': 'LinkeSphere Port',
    'settings.browser.debugPorts': 'Chrome Debug Ports',
    
    // Messengers settings
    'settings.messengers.telegramToken': 'Telegram Bot Token',
    'settings.messengers.slackToken': 'Slack API Token',
    
    // Other settings
    'settings.other.captchaToken': 'Captcha Token',
  },
  ru: {
    // General
    'app.title': 'Платформа Автоматизации',
    'app.settings': 'Настройки',
    'app.save': 'Сохранить настройки',
    'app.saved': 'Настройки сохранены',
    
    // Sidebar
    'sidebar.dashboard': 'Панель управления',
    'sidebar.workflows': 'Рабочие процессы',
    'sidebar.canvas': 'Холст',
    'sidebar.settings': 'Настройки',
    'sidebar.servers': 'Серверы',
    'sidebar.botLaunch': 'Запуск ботов',
    'sidebar.aiAgents': 'ИИ Агенты',
    'sidebar.tables': 'Таблицы',
    'sidebar.profile': 'Профиль',
    'sidebar.files': 'Файлы',
    'sidebar.signOut': 'Выйти',
    
    // Settings page
    'settings.title': 'Настройки',
    'settings.general': 'Общие',
    'settings.browser': 'Браузер',
    'settings.messengers': 'Мессенджеры',
    'settings.other': 'Другое',
    'settings.language': 'Язык интерфейса',
    'settings.theme': 'Тема',
    'settings.theme.light': 'Светлая',
    'settings.theme.dark': 'Темная',
    'settings.theme.system': 'Системная',
    'settings.accentColor': 'Цвет акцента',
    
    // Browser settings
    'settings.browser.port': 'Порт LinkeSphere',
    'settings.browser.debugPorts': 'Порты отладки Chrome',
    
    // Messengers settings
    'settings.messengers.telegramToken': 'Токен Telegram бота',
    'settings.messengers.slackToken': 'Токен Slack API',
    
    // Other settings
    'settings.other.captchaToken': 'Токен Captcha',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ru')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
