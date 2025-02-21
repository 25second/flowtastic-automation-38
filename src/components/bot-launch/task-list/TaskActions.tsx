
import { Button } from "@/components/ui/button";
import { Play, StopCircle, Trash, Edit, Terminal } from "lucide-react";
import { useState } from "react";
import { AddTaskDialog } from "../AddTaskDialog";
import type { Task } from "@/types/task";

interface TaskActionsProps {
  task: Task;
  onViewLogs: (taskId: string) => void;
  onStartTask: (taskId: string) => void;
  onStopTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskActions({
  task,
  onViewLogs,
  onStartTask,
  onStopTask,
  onEditTask,
  onDeleteTask
}: TaskActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isRunning = task.status === "in_process";

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditComplete = (taskName: string) => {
    onEditTask(task);
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewLogs(task.id)}
        >
          <Terminal className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => isRunning ? onStopTask(task.id) : onStartTask(task.id)}
        >
          {isRunning ? <StopCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEditClick}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteTask(task.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <AddTaskDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
        onAdd={handleEditComplete}
        mode="edit"
        initialData={task}
      />
    </>
  );
}
