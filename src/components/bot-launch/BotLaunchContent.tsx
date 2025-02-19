
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Play, StopCircle, Trash, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TaskList } from "./TaskList";
import { AddTaskDialog } from "./AddTaskDialog";
import { Task } from "@/types/task";
import { toast } from "sonner";

export function BotLaunchContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
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

  const filteredTasks = tasks.filter(task => {
    const searchLower = searchQuery.toLowerCase();
    const matchName = task.name.toLowerCase().includes(searchLower);
    const matchStatus = task.status.toLowerCase().includes(searchLower);
    const matchDate = format(task.startTime, "PPp").toLowerCase().includes(searchLower) ||
                     (task.endTime && format(task.endTime, "PPp").toLowerCase().includes(searchLower));
    
    return matchName || matchStatus || matchDate;
  });

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

  const handleSelectTask = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map(task => task.id)));
    }
  };

  const handleStartTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: "in_process" } : task
    ));
    toast.success("Task started successfully");
  };

  const handleStopTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: "done", endTime: new Date() } : task
    ));
    toast.success("Task stopped successfully");
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
  };

  const handleEditTask = (task: Task) => {
    // Implement edit functionality
    toast.info("Edit functionality to be implemented");
  };

  const handleViewLogs = (taskId: string) => {
    // Implement logs view functionality
    toast.info("View logs functionality to be implemented");
  };

  const handleBulkStart = () => {
    setTasks(tasks.map(task => 
      selectedTasks.has(task.id) ? { ...task, status: "in_process" } : task
    ));
    toast.success("Selected tasks started successfully");
  };

  const handleBulkStop = () => {
    setTasks(tasks.map(task => 
      selectedTasks.has(task.id) ? { ...task, status: "done", endTime: new Date() } : task
    ));
    toast.success("Selected tasks stopped successfully");
  };

  const handleBulkDelete = () => {
    setTasks(tasks.filter(task => !selectedTasks.has(task.id)));
    setSelectedTasks(new Set());
    toast.success("Selected tasks deleted successfully");
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
            placeholder="Search tasks by name, status, or dates..."
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

      {selectedTasks.size > 0 && (
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBulkStart}>
            <Play className="mr-2 h-4 w-4" />
            Start Selected
          </Button>
          <Button variant="outline" onClick={handleBulkStop}>
            <StopCircle className="mr-2 h-4 w-4" />
            Stop Selected
          </Button>
          <Button variant="destructive" onClick={handleBulkDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}

      <TaskList 
        tasks={filteredTasks}
        selectedTasks={selectedTasks}
        onSelectTask={handleSelectTask}
        onSelectAll={handleSelectAll}
        onStartTask={handleStartTask}
        onStopTask={handleStopTask}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
        onViewLogs={handleViewLogs}
      />
      
      <AddTaskDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddTask}
      />
    </div>
  );
}
