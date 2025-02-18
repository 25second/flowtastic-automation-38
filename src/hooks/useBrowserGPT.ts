
import { useState } from 'react';
import { toast } from 'sonner';

export const useBrowserGPT = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const executePrompt = async (prompt: string) => {
    if (!prompt.trim()) {
      throw new Error('Prompt is required');
    }

    setIsProcessing(true);
    try {
      // Здесь будет реальная интеграция с BrowserGPT
      // В будущих обновлениях добавим фактическую логику
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({ success: true }), 1000)
      );
      return response;
    } catch (error) {
      console.error('BrowserGPT execution error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    executePrompt,
  };
};
