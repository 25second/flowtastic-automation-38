
import { Server } from '@/types/server';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ServerCardProps {
  server: Server;
  onDelete: (id: string) => void;
}

export function ServerCard({ server, onDelete }: ServerCardProps) {
  const formatLastChecked = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="p-4 border rounded-lg flex items-center justify-between bg-white">
      <div>
        <h3 className="font-medium">{server.name || 'Unnamed Server'}</h3>
        <p className="text-sm text-gray-600">{server.url}</p>
        <div className="flex items-center gap-2 mt-1">
          <div
            className={`h-2 w-2 rounded-full ${
              server.is_active ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-600">
            {server.is_active ? 'Online' : 'Offline'}
          </span>
          {server.last_status_check && (
            <span className="text-sm text-gray-500">
              (Last checked: {formatLastChecked(server.last_status_check)})
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(server.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
