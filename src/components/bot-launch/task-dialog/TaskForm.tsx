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

interface TaskFormProps {
  onAdd: (taskName: string) => void;
  open: boolean;
}

export function TaskForm({ onAdd, open }: TaskFormProps) {
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

  const { workflows, isLoading: isLoadingWorkflows } = useWorkflowManager([], []);
  const userWorkflows = workflows?.filter(workflow => workflow.user_id === session?.user?.id) || [];
  const { servers } = useServerState();

  const {
    sessions,
    selectedSessions: managedSessions,
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
        loadingSessions={loadingSessions}
        onStartSession={startSession}
        onStopSession={stopSession}
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
        Create Task
      </Button>
    </form>
  );
}
