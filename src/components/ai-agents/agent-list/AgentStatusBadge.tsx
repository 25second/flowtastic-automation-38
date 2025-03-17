
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

interface AgentStatusBadgeProps {
  status: 'idle' | 'running' | 'completed' | 'error';
}

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  const { t } = useLanguage();
  
  switch (status) {
    case 'idle':
      return (
        <Badge variant="outline" className="text-muted-foreground">
          {t('status.idle')}
        </Badge>
      );
    case 'running':
      return (
        <Badge variant="default" className="bg-green-600">
          {t('status.running')}
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="default" className="bg-blue-600">
          {t('status.completed')}
        </Badge>
      );
    case 'error':
      return (
        <Badge variant="destructive">
          {t('status.error')}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status || t('status.unknown')}
        </Badge>
      );
  }
}
