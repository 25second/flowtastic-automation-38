
import { useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useTaskForm(onAdd: (taskName: string) => void) {
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

  const handleSubmit = async (e: React.FormEvent, sessions: any[]) => {
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

  return {
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
    selectedCategory,
    setSelectedCategory,
    handleSubmit,
    resetForm
  };
}
