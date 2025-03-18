
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-dialog/TaskForm";
import type { Task } from "@/types/task";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (taskName: string) => void;
  mode?: "create" | "edit";
  initialData?: Task;
}

export function AddTaskDialog({ 
  open, 
  onOpenChange, 
  onAdd,
  mode = "create",
  initialData 
}: AddTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>
        <TaskForm 
          onAdd={onAdd} 
          open={open} 
          onOpenChange={onOpenChange}
          mode={mode}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}
