
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Play, Server } from 'lucide-react';

interface ToolbarProps {
  servers: Array<{id: string, url: string}>;
  selectedServer: string;
  onServerSelect: (serverId: string) => void;
  onAddServerClick: () => void;
  onStartWorkflow: () => void;
  onCreateWithAI: () => void;
  onViewScript: () => void;
}

export const Toolbar = ({
  servers,
  selectedServer,
  onServerSelect,
  onAddServerClick,
  onStartWorkflow,
  onCreateWithAI,
  onViewScript,
}: ToolbarProps) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <Select value={selectedServer} onValueChange={onServerSelect}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select server" />
        </SelectTrigger>
        <SelectContent>
          {servers.map(server => (
            <SelectItem key={server.id} value={server.id}>
              {server.url}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        onClick={onAddServerClick}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Server className="h-4 w-4" />
        Add Server
      </Button>
      
      <Button 
        onClick={onStartWorkflow}
        className="bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)] flex items-center gap-2"
      >
        <Play className="h-4 w-4" />
        Start Workflow
      </Button>
      
      <Button 
        onClick={onCreateWithAI}
        className="bg-[#9b87f5] hover:bg-[#8B5CF6] transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:shadow-[0_0_20px_rgba(139,92,246,0.7)] flex items-center gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Create with AI ✨
      </Button>
      
      <Button 
        onClick={onViewScript}
        variant="secondary"
      >
        View Script
      </Button>
    </div>
  );
};
