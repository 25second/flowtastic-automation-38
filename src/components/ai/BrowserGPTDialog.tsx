
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface BrowserGPTDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BrowserGPTDialog = ({ open, onOpenChange }: BrowserGPTDialogProps) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsProcessing(true);
    try {
      // Здесь будет логика обработки промпта через BrowserGPT
      // В будущих обновлениях добавим интеграцию с BrowserGPT API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Временная имитация запроса
      toast.success('Action completed successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('BrowserGPT error:', error);
      toast.error('Failed to process your request');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>BrowserGPT Actions</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              What would you like the browser to do?
            </label>
            <Textarea
              id="prompt"
              placeholder="Enter your instructions here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Execute'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
