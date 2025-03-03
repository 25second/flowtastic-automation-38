
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export function ChatInput({ 
  onSubmit, 
  placeholder = "Type your message...", 
  isLoading = false,
  className
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={cn("relative flex items-center", className)}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full px-4 py-3 border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          disabled={isLoading}
        />
        {isLoading ? (
          <div className="absolute right-4 h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost"
            className="absolute right-2"
            disabled={message.trim() === ""}
          >
            <Send className="h-5 w-5 text-green-500" />
          </Button>
        )}
      </div>
    </form>
  );
}
