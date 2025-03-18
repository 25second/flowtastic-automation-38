import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskScheduling } from "./TaskScheduling";
import { TaskRepetition } from "./TaskRepetition";

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (taskName: string) => void;
  setWorkflowForAgent: (workflowId: string) => void;
}

export function TaskForm({ open, onOpenChange, onAdd, setWorkflowForAgent }: TaskFormProps) {
  const { session } = useAuth();
  const [taskName, setTaskName] = useState("");
  const [taskColor, setTaskColor] = useState("#3B82F6");
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [selectedServers, setSelectedServers] = useState<Set<string>>(new Set());
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [runImmediately, setRunImmediately] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("");
  const [repeatCount, setRepeatCount] = useState(1);
  const [runMultiple, setRunMultiple] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [workflows, setWorkflows] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);
    
  useEffect(() => {
    if (open) {
      fetchWorkflows();
      fetchServers();
    }
  }, [open]);

  const fetchWorkflows = async () => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('id, name');

      if (error) {
        throw error;
      }
      setWorkflows(data || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast.error("Failed to load workflows");
    }
  };

  const fetchServers = async () => {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('id, name, url');

      if (error) {
        throw error;
      }
      setServers(data || []);
    } catch (error) {
      console.error('Error fetching servers:', error);
      toast.error("Failed to load servers");
    }
  };

  const resetForm = () => {
    setTaskName("");
    setTaskColor("#3B82F6");
    setSelectedWorkflow(null);
    setSelectedServers(new Set());
    setSelectedSessions(new Set());
    setRunImmediately(true);
    setStartDate(null);
    setStartTime("");
    setRepeatCount(1);
    setRunMultiple(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("You must be logged in to create tasks");
      return;
    }

    if (!taskName.trim()) {
      toast.error("Task name is required");
      return;
    }

    if (!selectedWorkflow) {
      toast.error("Please select a workflow");
      return;
    }

    if (selectedServers.size === 0) {
      toast.error("Please select at least one server");
      return;
    }

    try {
      const startDateTime = !runImmediately && startDate && startTime 
        ? new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`).toISOString()
        : null;

      const taskData = {
        name: taskName.trim(),
        color: taskColor,
        workflow_id: selectedWorkflow,
        servers: Array.from(selectedServers),
        browser_sessions: [],
        start_time: startDateTime,
        run_immediately: runImmediately,
        repeat_count: runMultiple ? repeatCount : 1,
        status: 'pending' as const,
        user_id: session.user.id,
        category: selectedCategory
      };

      const { error } = await supabase
        .from('tasks')
        .insert(taskData);

      if (error) throw error;

      toast.success("Task created successfully");
      onAdd(taskName);
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error("Failed to create task");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Task Name and Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="taskName">Task Name</Label>
          <Input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task name"
          />
        </div>
        <div>
          <Label htmlFor="taskColor">Task Color</Label>
          <Input
            type="color"
            id="taskColor"
            value={taskColor}
            onChange={(e) => setTaskColor(e.target.value)}
          />
        </div>
      </div>

      {/* Workflow Selection */}
      <div>
        <Label htmlFor="workflow">Workflow</Label>
        <Select onValueChange={(value) => {
            setSelectedWorkflow(value);
            setWorkflowForAgent(value);
          }}
        >
          <SelectTrigger id="workflow">
            <SelectValue placeholder="Select a workflow" />
          </SelectTrigger>
          <SelectContent>
            {workflows.map((workflow) => (
              <SelectItem key={workflow.id} value={workflow.id}>
                {workflow.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Server Selection */}
      <div>
        <Label>Servers</Label>
        <div className="flex flex-wrap gap-2">
          {servers.map((server) => (
            <div key={server.id} className="space-x-2 flex items-center">
              <Checkbox
                id={`server-${server.id}`}
                checked={selectedServers.has(server.id)}
                onCheckedChange={(checked) => {
                  const newServers = new Set(selectedServers);
                  if (checked) {
                    newServers.add(server.id);
                  } else {
                    newServers.delete(server.id);
                  }
                  setSelectedServers(newServers);
                }}
              />
              <Label htmlFor={`server-${server.id}`}>{server.name || server.url}</Label>
            </div>
          ))}
        </div>
      </div>
    
    {/* Task scheduling section */}
    <div className="space-y-4">
      <TaskScheduling
        runImmediately={runImmediately}
        setRunImmediately={setRunImmediately}
        startDate={startDate}
        setStartDate={setStartDate}
        startTime={startTime}
        setStartTime={setStartTime}
      />
      
      {/* Task repetition section */}
      <TaskRepetition
        runMultiple={runMultiple}
        setRunMultiple={setRunMultiple}
        repeatCount={repeatCount}
        setRepeatCount={setRepeatCount}
      />
    </div>
    
    {/* Form footer with submit button */}
    <div className="mt-6 flex justify-end gap-2">
      <Button variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={!selectedWorkflow || selectedServers.size === 0}
      >
        Create Task
      </Button>
    </div>
    </form>
  );
}
