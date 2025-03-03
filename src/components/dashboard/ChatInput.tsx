
import React, { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function ChatInput({ onSubmit, placeholder = "Задайте вопрос...", isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit(message);
      setMessage('');
    }
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
    </div>
  );
}
