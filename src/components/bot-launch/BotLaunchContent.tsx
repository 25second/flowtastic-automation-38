
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TaskList } from "./TaskList";
import { AddTaskDialog } from "./AddTaskDialog";
import { Task } from "@/types/task";

export function BotLaunchContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "Parse LinkedIn Profiles",
      status: "pending",
      startTime: new Date(),
      endTime: null,
    },
    {
      id: "2",
      name: "Export Data to CSV",
      status: "in_process",
      startTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      endTime: null,
    },
    {
      id: "3",
      name: "Update Database",
      status: "done",
      startTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      endTime: new Date(),
    },
    {
      id: "4",
      name: "Validate Emails",
      status: "error",
      startTime: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      endTime: new Date(),
    },
  ]);

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTask = (taskName: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      status: "pending",
      startTime: new Date(),
      endTime: null,
    };
    setTasks([newTask, ...tasks]);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bot Launch</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <TaskList tasks={filteredTasks} />
      
      <AddTaskDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddTask}
      />
    </div>
  );
}
