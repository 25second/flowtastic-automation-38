
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useServerState } from "@/hooks/useServerState";
import { useSessionManagement } from "@/components/flow/browser-select/useSessionManagement";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWorkflowManager } from "@/hooks/useWorkflowManager";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { TaskNameInput } from "./task-dialog/TaskNameInput";
import { WorkflowSelect } from "./task-dialog/WorkflowSelect";
import { ServerSelect } from "./task-dialog/ServerSelect";
import { BrowserSessionsList } from "./task-dialog/BrowserSessionsList";
import { TaskScheduling } from "./task-dialog/TaskScheduling";
import { TaskRepetition } from "./task-dialog/TaskRepetition";

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

  const { workflows, isLoading: isLoadingWorkflows } = useWorkflowManager([], []);
  const userWorkflows = workflows?.filter(workflow => workflow.user_id === session?.user?.id) || [];

  const { 
    servers,
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
  } = useSessionManagement(open, 'linkenSphere', () => {});

  useEffect(() => {
    if (open) {
      const now = new Date();
      setServerTime(format(now, "PPp"));
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
      const startDateTime = !runImmediately && startDate && startTime 
        ? new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`).toISOString()
        : null;

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
        start_time: startDateTime,
        run_immediately: runImmediately,
        repeat_count: runMultiple ? repeatCount : 1,
        status: 'pending' as const,
        user_id: session.user.id
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
          <TaskNameInput
            taskName={taskName}
            taskColor={taskColor}
            onNameChange={setTaskName}
            onColorChange={setTaskColor}
          />

          <WorkflowSelect
            selectedWorkflow={selectedWorkflow}
            onWorkflowChange={setSelectedWorkflow}
            userWorkflows={userWorkflows}
            isLoadingWorkflows={isLoadingWorkflows}
          />

          <ServerSelect
            servers={servers}
            selectedServers={selectedServers}
            onServerSelect={setSelectedServers}
          />

          <BrowserSessionsList
            sessions={sessions}
            selectedSessions={selectedSessions}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSessionSelect={() => {}}
            isSessionActive={isSessionActive}
            loadingSessions={loadingSessions}
            onStartSession={startSession}
            onStopSession={stopSession}
          />

          <TaskScheduling
            runImmediately={runImmediately}
            onRunImmediatelyChange={setRunImmediately}
            serverTime={serverTime}
            startDate={startDate}
            onStartDateChange={setStartDate}
            startTime={startTime}
            onStartTimeChange={setStartTime}
          />

          <TaskRepetition
            runMultiple={runMultiple}
            onRunMultipleChange={setRunMultiple}
            repeatCount={repeatCount}
            onRepeatCountChange={setRepeatCount}
          />

          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
