
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TaskNameInput } from "./TaskNameInput";
import { WorkflowSelect } from "./WorkflowSelect";
import { ServerSelect } from "./ServerSelect";
import { BrowserSessionsList } from "./BrowserSessionsList";
import { TaskScheduling } from "./TaskScheduling";
import { TaskRepetition } from "./TaskRepetition";
import { useTaskForm } from "./useTaskForm";
import { useWorkflowManager } from "@/hooks/useWorkflowManager";
import { useServerState } from "@/hooks/useServerState";
import { useSessionManagement } from "@/components/flow/browser-select/useSessionManagement";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Task } from "@/types/task";

interface TaskFormProps {
  onAdd: (taskName: string) => void;
  open: boolean;
  mode?: "create" | "edit";
  initialData?: Task;
}

export function TaskForm({ onAdd, open, mode = "create", initialData }: TaskFormProps) {
  const { session } = useAuth();
  const [serverTime, setServerTime] = useState("");
  
  const {
    taskName,
    setTaskName,
    taskColor,
    setTaskColor,
    selectedWorkflow,
    setSelectedWorkflow,
    selectedServers,
    setSelectedServers,
    selectedSessions,
    setSelectedSessions,
    runImmediately,
    setRunImmediately,
    startDate,
    setStartDate,
    startTime,
    setStartTime,
    repeatCount,
    setRepeatCount,
    runMultiple,
    setRunMultiple,
    handleSubmit
  } = useTaskForm(onAdd);

  // Initialize form with initial data if in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTaskName(initialData.name || "");
      setTaskColor(initialData.color || "#3B82F6");
      setSelectedWorkflow(initialData.workflow_id || null);
      setSelectedServers(new Set(initialData.servers || []));
      setSelectedSessions(new Set(initialData.browser_sessions?.map(s => s.id) || []));
      setRunImmediately(!initialData.start_time);
      if (initialData.start_time) {
        const date = new Date(initialData.start_time);
        setStartDate(date);
        setStartTime(format(date, "HH:mm"));
      }
      setRunMultiple(initialData.repeat_count > 1);
      setRepeatCount(initialData.repeat_count || 1);
    }
  }, [mode, initialData]);

  const { workflows, isLoading: isLoadingWorkflows } = useWorkflowManager([], []);
  const userWorkflows = workflows?.filter(workflow => workflow.user_id === session?.user?.id) || [];
  const { servers } = useServerState();

  const {
    sessions,
    searchQuery,
    setSearchQuery,
    isSessionActive,
  } = useSessionManagement(open, 'linkenSphere', () => {});

  useEffect(() => {
    if (open) {
      const now = new Date();
      setServerTime(format(now, "PPp"));
    }
  }, [open]);

  const handleSessionSelect = (newSelectedSessions: Set<string>) => {
    setSelectedSessions(newSelectedSessions);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, sessions)} className="space-y-6">
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
        onSessionSelect={handleSessionSelect}
        isSessionActive={isSessionActive}
        selectedServers={selectedServers}
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
        {mode === "edit" ? "Save Changes" : "Create Task"}
      </Button>
    </form>
  );
}
