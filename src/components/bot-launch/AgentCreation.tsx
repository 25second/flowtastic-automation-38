
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChatInput } from '@/components/dashboard/ChatInput';
import { Bot } from 'lucide-react';
import { toast } from 'sonner';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

export function AgentCreation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add an initial greeting message when the component mounts
  useEffect(() => {
    const initialGreeting: Message = {
      id: crypto.randomUUID(),
      content: "Чем займемся сегодня?",
      role: 'assistant',
      timestamp: new Date(),
    };
    
    setMessages([initialGreeting]);
  }, []);

  const handleSubmit = async (message: string) => {
    // Add user message to chat
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: message,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // This is a placeholder for actual AI interaction
      // In a real implementation, you would call your AI service here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const botResponse: Message = {
        id: crypto.randomUUID(),
        content: `I'll create an agent based on your request: "${message}"`,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error in agent creation:', error);
      toast.error('Не удалось получить ответ от ИИ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Bot className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Создание нового агента</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Опишите задачу, которую должен выполнять агент, и искусственный интеллект поможет создать его.
            </p>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <Card key={message.id} className={`${message.role === 'user' ? 'bg-muted' : 'bg-card'}`}>
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                      {message.role === 'user' ? 'Вы' : <Bot className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p>{message.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {isLoading && (
              <Card className="bg-card">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full p-2 bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-3">
                          <div className="h-2 bg-gray-200 rounded"></div>
                          <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
      
      <div className="sticky bottom-0 bg-background pt-2">
        <ChatInput 
          onSubmit={handleSubmit} 
          placeholder="Опиши подробно задачу агента, который требуется создать..."
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
