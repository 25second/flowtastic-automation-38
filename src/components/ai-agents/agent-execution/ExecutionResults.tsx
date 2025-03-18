
import { ScrollArea } from '@/components/ui/scroll-area';
import { Circle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useLanguage } from "@/hooks/useLanguage";

interface ExecutionStep {
  id: string;
  status: 'completed' | 'failed' | 'pending' | 'in_progress';
  description: string;
  result?: string;
  screenshot?: string;
}

interface ExecutionResultsProps {
  executionResult: {
    steps?: ExecutionStep[];
  } | null;
}

export function ExecutionResults({ executionResult }: ExecutionResultsProps) {
  const { t } = useLanguage();
  
  if (!executionResult || !executionResult.steps || executionResult.steps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{t('agents.execution_result')}</h3>
      <ScrollArea className="h-60">
        <div className="space-y-2">
          {executionResult.steps.map((step, index) => (
            <div key={step.id} className="border rounded-md p-3">
              <div className="flex items-center gap-2 mb-1">
                {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {step.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                {step.status === 'pending' && <Circle className="h-4 w-4 text-gray-400" />}
                {step.status === 'in_progress' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                <span className="font-medium">Step {index + 1}</span>
              </div>
              <p className="text-sm">{step.description}</p>
              {step.result && (
                <div className="mt-2 p-2 text-xs bg-accent/50 rounded-md">
                  {step.result}
                </div>
              )}
              {step.screenshot && (
                <div className="mt-2">
                  <img 
                    src={`/storage/screenshots/${step.screenshot}`} 
                    alt={`Step ${index + 1} screenshot`}
                    className="max-w-full rounded border"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
