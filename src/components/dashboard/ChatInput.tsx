import React, { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function ChatInput({ onSubmit, placeholder = "Опиши подробно задачу, которую требуется выполнить", isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit(message);
      setMessage('');
    }
  };

  const presetMessages = [
    "Зарегистрируй мне domain.com почту",
    "Зайди на сайт domain.com и добавь в корзину случайно 5-6 товаров",
    "Выпиши новую статистику по кампаниям в таблицу"
  ];

  const handlePresetMessageClick = (presetMessage: string) => {
    setMessage(presetMessage);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="pr-20 py-6 text-base rounded-xl shadow-sm border-gray-300 focus:border-primary/50 focus:ring-primary/50 w-full bg-white"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim() || isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-primary hover:bg-primary/90"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </form>
      
      {/* Preset message buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        {presetMessages.map((presetMessage, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-sm py-1 px-3 text-gray-700 border-gray-300 hover:bg-accent/5 hover:text-primary hover:border-primary/30 transition-colors rounded-full"
            onClick={() => handlePresetMessageClick(presetMessage)}
          >
            {presetMessage}
          </Button>
        ))}
      </div>
    </div>
  );
}
