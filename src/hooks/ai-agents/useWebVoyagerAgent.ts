
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AgentController } from '@/components/ai-agents/scripts/webVoyagerAgent';

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
      
      const defaultProvider = settingsData?.value || { provider: 'OpenAI', model: 'gpt-4o-mini' };
      
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
   * Проверяет и подготавливает браузерную сессию
   */
  const prepareBrowserSession = async () => {
    if (!browserPort) {
      throw new Error("Browser port is not specified");
    }
    
    try {
      // Здесь можно добавить проверку активности сессии
      return true;
    } catch (error) {
      console.error("Error checking browser session:", error);
      throw error;
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
    
    try {
      addLog(`Starting agent for task: ${task}`);
      
      // Получаем настройки AI провайдера
      const providerConfig = await getAIProviderConfig();
      addLog(`Using AI provider: ${providerConfig.provider}, model: ${providerConfig.modelName}`);
      
      // Подготавливаем браузерную сессию
      await prepareBrowserSession();
      addLog(`Browser session prepared on port ${browserPort}`);
      
      // Здесь должен быть код инициализации Playwright и подключения к браузеру
      // В реальном приложении это будет более сложный процесс с использованием
      // существующих механизмов подключения к браузеру
      
      // Заглушка для демонстрации
      const mockPage = {
        content: async () => "<html><body><h1>Test Page</h1></body></html>",
        url: async () => "https://example.com",
        click: async (selector: string) => console.log(`Click on ${selector}`),
        fill: async (selector: string, value: string) => console.log(`Fill ${selector} with ${value}`),
        goto: async (url: string) => console.log(`Navigate to ${url}`),
        textContent: async (selector: string) => "Example text content",
        waitForSelector: async (selector: string) => console.log(`Wait for ${selector}`),
        waitForLoadState: async (state: string) => console.log(`Wait for load state ${state}`)
      };
      
      // Создаем контроллер агента
      const agentController = new AgentController(
        providerConfig.apiKey,
        providerConfig.modelName,
        mockPage
      );
      
      // Запускаем выполнение задачи
      addLog(`Executing task: ${task}`);
      const result = await agentController.executeTask(task, tableId);
      
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
