
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface TaskListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddTask: () => void;
}

export function TaskListHeader({ searchQuery, onSearchChange, onAddTask }: TaskListHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bot Launch</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks by name, status, or dates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={onAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
    </>
  );
}
