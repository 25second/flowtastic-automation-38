import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus, Play, StopCircle, Trash, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TaskList } from "./TaskList";
import { AddTaskDialog } from "./AddTaskDialog";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export function BotLaunchContent() {
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchTasks();
    }
  }, [session?.user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTasks: Task[] = data.map(task => ({
        ...task,
        browser_sessions: Array.isArray(task.browser_sessions) 
          ? task.browser_sessions 
          : [],
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const searchLower = searchQuery.toLowerCase();
    const matchName = task.name.toLowerCase().includes(searchLower);
    const matchStatus = task.status.toLowerCase().includes(searchLower);
    const matchDate = format(new Date(task.created_at), "PPp").toLowerCase().includes(searchLower) ||
                     (task.status === 'done' && format(new Date(task.updated_at), "PPp").toLowerCase().includes(searchLower));
    
    return matchName || matchStatus || matchDate;
  });

  const handleAddTask = (taskName: string) => {
    setIsAddDialogOpen(false);
    fetchTasks(); // Refresh the task list
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

  const handleStartTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'in_process' as const })
        .eq('id', taskId);

      if (error) throw error;
      await fetchTasks();
      toast.success("Task started successfully");
    } catch (error) {
      console.error('Error starting task:', error);
      toast.error("Failed to start task");
    }
  };

  const handleStopTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: 'done',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      await fetchTasks();
      toast.success("Task stopped successfully");
    } catch (error) {
      console.error('Error stopping task:', error);
      toast.error("Failed to stop task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      await fetchTasks();
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task");
    }
  };

  const handleEditTask = (task: Task) => {
    // Implement edit functionality
    toast.info("Edit functionality to be implemented");
  };

  const handleViewLogs = (taskId: string) => {
    // Implement logs view functionality
    toast.info("View logs functionality to be implemented");
  };

  const handleBulkStart = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'in_process' as const })
        .in('id', Array.from(selectedTasks));

      if (error) throw error;
      await fetchTasks();
      toast.success("Selected tasks started successfully");
    } catch (error) {
      console.error('Error starting tasks:', error);
      toast.error("Failed to start selected tasks");
    }
  };

  const handleBulkStop = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: 'done',
          updated_at: new Date().toISOString()
        })
        .in('id', Array.from(selectedTasks));

      if (error) throw error;
      await fetchTasks();
      toast.success("Selected tasks stopped successfully");
    } catch (error) {
      console.error('Error stopping tasks:', error);
      toast.error("Failed to stop selected tasks");
    }
  };

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', Array.from(selectedTasks));

      if (error) throw error;
      await fetchTasks();
      setSelectedTasks(new Set());
      toast.success("Selected tasks deleted successfully");
    } catch (error) {
      console.error('Error deleting tasks:', error);
      toast.error("Failed to delete selected tasks");
    }
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
