
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { TaskList } from "./TaskList";
import { TaskListHeader } from "./TaskListHeader";
import { BulkActions } from "./BulkActions";
import { AddTaskDialog } from "./AddTaskDialog";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useTaskExecution } from "@/hooks/useTaskExecution";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, List } from "lucide-react";
import { AgentCreation } from "./AgentCreation";

export function BotLaunchContent() {
  const { session } = useAuth();
  const { startTask, stopTask } = useTaskExecution();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("task-list");

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
          ? task.browser_sessions.map((session: any) => ({
              id: String(session.id || ''),
              type: (session.type as 'browser' | 'session') || 'session',
              port: typeof session.port === 'number' ? session.port : undefined,
              status: typeof session.status === 'string' ? session.status : undefined
            }))
          : []
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
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      toast.error('Task not found');
      return;
    }
    await startTask(task);
    await fetchTasks();
  };

  const handleStopTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      toast.error('Task not found');
      return;
    }
    await stopTask(task);
    await fetchTasks();
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

  const handleBulkStart = async () => {
    for (const taskId of selectedTasks) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await startTask(task);
      }
    }
    await fetchTasks();
  };

  const handleBulkStop = async () => {
    for (const taskId of selectedTasks) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await stopTask(task);
      }
    }
    await fetchTasks();
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="ml-auto">
          <TabsList className="grid grid-cols-2 w-[300px]">
            <TabsTrigger value="agent-creation" className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              <span>Создание агента</span>
            </TabsTrigger>
            <TabsTrigger value="task-list" className="flex items-center gap-1">
              <List className="h-4 w-4" />
              <span>Список агентов</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "task-list" ? (
        <>
          <TaskListHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddTask={() => setIsAddDialogOpen(true)}
          />
          
          {selectedTasks.size > 0 && (
            <BulkActions
              onBulkStart={handleBulkStart}
              onBulkStop={handleBulkStop}
              onBulkDelete={handleBulkDelete}
            />
          )}

          <TaskList 
            tasks={filteredTasks}
            selectedTasks={selectedTasks}
            onSelectTask={handleSelectTask}
            onSelectAll={handleSelectAll}
            onStartTask={handleStartTask}
            onStopTask={handleStopTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={(task) => toast.info("Edit functionality to be implemented")}
            onViewLogs={(taskId) => toast.info("View logs functionality to be implemented")}
          />
          
          <AddTaskDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAdd={(taskName) => {
              setIsAddDialogOpen(false);
              fetchTasks();
            }}
          />
        </>
      ) : (
        <AgentCreation />
      )}
    </div>
  );
}
