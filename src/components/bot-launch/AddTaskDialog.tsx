
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useWorkflowManager } from "@/hooks/useWorkflowManager";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (taskName: string) => void;
}

export function AddTaskDialog({ open, onOpenChange, onAdd }: AddTaskDialogProps) {
  const { session } = useAuth();
  const [taskName, setTaskName] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");
  const { workflows, isLoading: isLoadingWorkflows } = useWorkflowManager([], []);

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

    try {
      const taskData = {
        name: taskName.trim(),
        color: "#" + Math.floor(Math.random()*16777215).toString(16), // Random color
        workflow_id: selectedWorkflow,
        servers: [],
        browser_sessions: [],
        start_time: null,
        run_immediately: true,
        repeat_count: 1,
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
    setSelectedWorkflow("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="workflow">Workflow</Label>
              <Select 
                value={selectedWorkflow} 
                onValueChange={setSelectedWorkflow}
              >
                <SelectTrigger id="workflow">
                  <SelectValue placeholder="Select a workflow" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingWorkflows ? (
                    <SelectItem value="loading" disabled>
                      Loading workflows...
                    </SelectItem>
                  ) : workflows && workflows.length > 0 ? (
                    workflows.map((workflow) => (
                      <SelectItem key={workflow.id} value={workflow.id}>
                        {workflow.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-workflows" disabled>
                      No workflows found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
