
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Calendar 
} from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useServerState } from "@/hooks/useServerState";
import { useSessionManagement } from "@/components/flow/browser-select/useSessionManagement";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWorkflowManager } from "@/hooks/useWorkflowManager";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (taskName: string) => void;
}

export function AddTaskDialog({ open, onOpenChange, onAdd }: AddTaskDialogProps) {
  const { session } = useAuth();
  const [taskName, setTaskName] = useState("");
  const [taskColor, setTaskColor] = useState("#3B82F6");
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [selectedServers, setSelectedServers] = useState<Set<string>>(new Set());
  const [runImmediately, setRunImmediately] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("");
  const [repeatCount, setRepeatCount] = useState(1);
  const [runMultiple, setRunMultiple] = useState(false);
  const [serverTime, setServerTime] = useState<string>("");

  const { workflows } = useWorkflowManager([], []);
  const { 
    selectedServer,
    servers,
    selectedBrowser,
    setSelectedBrowser
  } = useServerState();

  const {
    sessions,
    selectedSessions,
    searchQuery,
    setSearchQuery,
    startSession,
    stopSession,
    isSessionActive,
    loadingSessions
  } = useSessionManagement(open, 'linkenSphere', setSelectedBrowser);

  useEffect(() => {
    // Get server time
    const fetchServerTime = async () => {
      try {
        const { data, error } = await supabase.rpc('get_server_time');
        if (error) throw error;
        setServerTime(format(new Date(data), "PPp"));
      } catch (error) {
        console.error("Error fetching server time:", error);
      }
    };
    
    if (open) {
      fetchServerTime();
    }
  }, [open]);

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
      const taskData = {
        name: taskName.trim(),
        color: taskColor,
        workflow_id: selectedWorkflow,
        servers: Array.from(selectedServers),
        browser_sessions: Array.from(selectedSessions).map(id => ({
          id,
          type: 'session',
          status: sessions.find(s => s.id === id)?.status,
          port: sessions.find(s => s.id === id)?.debug_port
        })),
        start_time: !runImmediately && startDate && startTime 
          ? new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`) 
          : null,
        run_immediately: runImmediately,
        repeat_count: runMultiple ? repeatCount : 1,
        status: 'pending',
        user_id: session.user.id
      };

      const { error } = await supabase
        .from('tasks')
        .insert([taskData]);

      if (error) throw error;

      toast.success("Task created successfully");
      onAdd(taskName);
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error("Failed to create task");
    }
  };

  const resetForm = () => {
    setTaskName("");
    setTaskColor("#3B82F6");
    setSelectedWorkflow(null);
    setSelectedServers(new Set());
    setRunImmediately(true);
    setStartDate(null);
    setStartTime("");
    setRepeatCount(1);
    setRunMultiple(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name</Label>
              <Input
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskColor">Task Color</Label>
              <Input
                id="taskColor"
                type="color"
                value={taskColor}
                onChange={(e) => setTaskColor(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Workflow</Label>
            <Select value={selectedWorkflow || ''} onValueChange={setSelectedWorkflow}>
              <SelectTrigger>
                <SelectValue placeholder="Select a workflow" />
              </SelectTrigger>
              <SelectContent>
                {workflows?.map((workflow) => (
                  <SelectItem key={workflow.id} value={workflow.id}>
                    {workflow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Servers</Label>
            <div className="flex flex-wrap gap-2">
              {servers.map((server) => (
                <Button
                  key={server.id}
                  type="button"
                  variant={selectedServers.has(server.id) ? "default" : "outline"}
                  onClick={() => {
                    const newSelected = new Set(selectedServers);
                    if (newSelected.has(server.id)) {
                      newSelected.delete(server.id);
                    } else {
                      newSelected.add(server.id);
                    }
                    setSelectedServers(newSelected);
                  }}
                >
                  {server.name || server.url}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Browser Sessions</Label>
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            <div className="border rounded-lg p-4 space-y-2">
              {sessions.map((session) => {
                const isActive = isSessionActive(session.status);
                const isSelected = selectedSessions.has(session.id);
                const isLoading = loadingSessions.get(session.id);

                return (
                  <div key={session.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center space-x-4">
                      <Switch
                        checked={isSelected}
                        onCheckedChange={() => {
                          const newSelected = new Set(selectedSessions);
                          if (isSelected) {
                            newSelected.delete(session.id);
                          } else {
                            newSelected.add(session.id);
                          }
                          // setSelectedSessions(newSelected);
                        }}
                      />
                      <div>
                        <p className="font-medium">{session.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: {session.status} {session.debug_port && `(Port: ${session.debug_port})`}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => isActive ? stopSession(session.id) : startSession(session.id)}
                    >
                      {isActive ? "Stop" : "Start"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Run Time</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={runImmediately}
                  onCheckedChange={setRunImmediately}
                />
                <span>Run Immediately</span>
              </div>
            </div>

            {!runImmediately && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Server Time</Label>
                  <p className="text-sm text-muted-foreground">{serverTime}</p>
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        className="rounded-md border"
                      />
                    </div>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Run Multiple Times</Label>
              <Switch
                checked={runMultiple}
                onCheckedChange={setRunMultiple}
              />
            </div>

            {runMultiple && (
              <div className="space-y-2">
                <Label>Number of Repetitions</Label>
                <Input
                  type="number"
                  min="1"
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(parseInt(e.target.value, 10))}
                  className="w-32"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
