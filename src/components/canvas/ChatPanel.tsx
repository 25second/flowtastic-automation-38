
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripHorizontal, MinimizeIcon, MaximizeIcon, SendIcon } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  chatHeight: number;
  isChatMinimized: boolean;
  isResizing: boolean;
  resizeRef: React.RefObject<HTMLDivElement>;
  setIsResizing: (value: boolean) => void;
  setIsChatMinimized: (value: boolean) => void;
}

export const ChatPanel = ({
  chatHeight,
  isChatMinimized,
  isResizing,
  resizeRef,
  setIsResizing,
  setIsChatMinimized
}: ChatPanelProps) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hello! I'm your AI assistant. How can I help you with your workflow today?"
  }]);
  const [currentMessage, setCurrentMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    
    setChatMessages(prev => [...prev, {
      role: 'user',
      content: currentMessage
    }]);
    setCurrentMessage('');

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: "I see you're working on a workflow. Would you like me to help you optimize it?"
      }]);
    }, 1000);
  };

  return (
    <Card className={`
      fixed bottom-4 right-4 w-80
      ${isChatMinimized ? 'h-12' : `h-[${chatHeight}px]`}
      transition-all duration-200
      shadow-lg hover:shadow-xl
      bg-white
      border border-zinc-200
      backdrop-blur-sm
      animate-fade-in
      z-50
      rounded-xl
      overflow-hidden
    `}>
      <div
        ref={resizeRef}
        className={`
          absolute -top-3 left-0 right-0 h-6 flex items-center justify-center
          cursor-ns-resize group z-50 hover:bg-zinc-100/50
          ${isResizing ? 'bg-zinc-100' : ''}
        `}
        onMouseDown={() => setIsResizing(true)}
      >
        <GripHorizontal className="h-4 w-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-2.5 flex justify-between items-center backdrop-blur-md bg-zinc-950 hover:bg-zinc-800">
        <span className="font-medium flex items-center gap-2 text-sm text-white">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          AI Flow Assistant
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-70 hover:opacity-100 transition-opacity text-white hover:text-white hover:bg-white/20"
          onClick={() => setIsChatMinimized(!isChatMinimized)}
        >
          {isChatMinimized ? <MaximizeIcon className="h-3.5 w-3.5" /> : <MinimizeIcon className="h-3.5 w-3.5" />}
        </Button>
      </div>
      
      <div className={`
        transition-all duration-300
        ${isChatMinimized ? 'opacity-0' : 'opacity-100'}
      `}>
        {!isChatMinimized && (
          <>
            <ScrollArea className="flex-1 p-3" style={{ height: chatHeight - 116 }}>
              <div className="space-y-3">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`
                      flex 
                      ${message.role === 'user' ? 'justify-end' : 'justify-start'}
                      animate-fade-in
                    `}
                  >
                    <div
                      className={`
                        max-w-[80%] rounded-2xl p-2.5 text-sm
                        transform transition-all duration-200
                        hover:scale-[1.02]
                        ${message.role === 'user' 
                          ? 'bg-zinc-900 text-white ml-auto rounded-br-sm'
                          : 'bg-gradient-to-br from-[#F97316] to-[#FEC6A1] text-white rounded-bl-sm'
                        }
                        shadow-sm hover:shadow-md
                      `}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-200 py-[6px] bg-zinc-50">
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask me about your workflow..."
                  className="flex-1 bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-300 text-sm h-9 my-0 py-0"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white transition-colors duration-200 hover:scale-105 active:scale-95 h-9 w-9"
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Card>
  );
};
