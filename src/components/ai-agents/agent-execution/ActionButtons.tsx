
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';
import { useLanguage } from "@/hooks/useLanguage";

interface ActionButtonsProps {
  isExecuting: boolean;
  onClose: () => void;
  onStartAgent: () => void;
  onStopAgent: () => void;
  canStart: boolean;
  isLoading: boolean;
}

export function ActionButtons({
  isExecuting,
  onClose,
  onStartAgent,
  onStopAgent,
  canStart,
  isLoading
}: ActionButtonsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        onClick={onClose}
        disabled={isExecuting}
      >
        {t('common.close')}
      </Button>
      
      {isExecuting ? (
        <Button 
          variant="destructive" 
          onClick={onStopAgent}
        >
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {t('agents.stop_execution')}
        </Button>
      ) : (
        <Button 
          onClick={onStartAgent}
          disabled={!canStart || isLoading}
        >
          <Bot className="h-4 w-4 mr-2" />
          {t('agents.start_execution')}
        </Button>
      )}
    </div>
  );
}
