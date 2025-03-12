
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AgentController } from '@/components/ai-agents/scripts/webVoyagerAgent';
import { chromium } from 'playwright';

interface UseWebVoyagerAgentProps {
  sessionId?: string;
  browserPort?: number;
}

export function useWebVoyagerAgent({ sessionId, browserPort }: UseWebVoyagerAgentProps = {}) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Добавляет лог в состояние
   */
  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `[${new Date().toISOString()}] ${message}`]);
  };
  
  /**
   * Получает настройки AI провайдера из базы данных
   */
  const getAIProviderConfig = async () => {
    try {
      // Получаем настройки провайдера по умолчанию
      const { data: settingsData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'default_ai_provider')
        .single();
      
      if (!settingsData?.value) {
        throw new Error('Default AI provider settings not found');
      }
      
      // Проверяем, что value - это объект с нужными свойствами
      const value = settingsData.value;
      const defaultProvider = typeof value === 'object' && value !== null 
        ? value as { provider: string; model: string }
        : { provider: 'OpenAI', model: 'gpt-4o-mini' };
      
      // Получаем API ключ для выбранного провайдера
      const { data: providerData } = await supabase
        .from('ai_providers')
        .select('api_key')
        .eq('name', defaultProvider.provider)
        .single();
      
      if (!providerData?.api_key) {
        throw new Error(`API key not found for provider ${defaultProvider.provider}`);
      }
      
      return {
        apiKey: providerData.api_key,
        modelName: defaultProvider.model || 'gpt-4o-mini',
        provider: defaultProvider.provider
      };
    } catch (error) {
      console.error("Error fetching AI provider config:", error);
      throw error;
    }
  };
  
  /**
   * Подключает к браузеру и создает страницу для автоматизации
   */
  const connectToBrowser = async () => {
    if (!browserPort) {
      throw new Error("Browser port is not specified");
    }
    
    try {
      // Подключаемся к запущенному браузеру по указанному порту
      const browserURL = `http://localhost:${browserPort}`;
      addLog(`Connecting to browser at ${browserURL}`);
      
      const browser = await chromium.connect(browserURL);
      const context = await browser.newContext();
      const page = await context.newPage();
      
      addLog('Successfully connected to browser and created new page');
      return { browser, context, page };
    } catch (error) {
      console.error("Error connecting to browser:", error);
      throw new Error(`Failed to connect to browser: ${error.message}`);
    }
  };
  
  /**
   * Запускает агента для выполнения задачи
   */
  const runAgent = async (task: string, tableId?: string) => {
    setIsRunning(true);
    setProgress(0);
    setLogs([]);
    setError(null);
    
    let browser: any = null;
    let context: any = null;
    let page: any = null;
    
    try {
      addLog(`Starting agent for task: ${task}`);
      
      // Получаем настройки AI провайдера
      const providerConfig = await getAIProviderConfig();
      addLog(`Using AI provider: ${providerConfig.provider}, model: ${providerConfig.modelName}`);
      
      // Устанавливаем интервал для имитации прогресса
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 5, 95);
          return newProgress;
        });
      }, 1000);
      
      // Подключаемся к браузеру
      const connection = await connectToBrowser();
      browser = connection.browser;
      context = connection.context;
      page = connection.page;
      
      // Создаем контроллер агента
      const agentController = new AgentController(
        providerConfig.apiKey,
        providerConfig.modelName,
        page
      );
      
      // Запускаем выполнение задачи
      addLog(`Executing task: ${task}`);
      const result = await agentController.executeTask(task, tableId);
      
      clearInterval(progressInterval);
      
      if (result.success) {
        setProgress(100);
        addLog(`Task completed successfully: ${result.message}`);
        toast.success("Task completed successfully");
      } else {
        setError(result.message);
        addLog(`Task failed: ${result.message}`);
        toast.error("Task failed");
      }
      
      return result;
    } catch (error) {
      setError(error.message);
      addLog(`Error: ${error.message}`);
      toast.error(`Error executing task: ${error.message}`);
      return {
        success: false,
        message: error.message
      };
    } finally {
      setIsRunning(false);
      
      // Закрываем все ресурсы браузера
      try {
        if (page) await page.close();
        if (context) await context.close();
        if (browser) await browser.close();
      } catch (closeError) {
        console.error("Error closing browser resources:", closeError);
      }
    }
  };
  
  return {
    runAgent,
    isRunning,
    progress,
    logs,
    error
  };
}
