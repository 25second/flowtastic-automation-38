
import { format } from "date-fns";
import { Task } from "@/types/task";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TaskListItemProps {
  task: Task;
}

export function TaskListItem({ task }: TaskListItemProps) {
  if (!task) {
    console.error("TaskListItem received null task");
    return null;
  }
  
  console.log("Rendering task item:", task.id, task.name);
  
  return (
    <div className="p-3 border border-[#F1F0FB] rounded-lg flex justify-between items-center bg-white hover:shadow-sm transition-shadow">
      <div className="flex-1">
        <div className="font-medium text-[#7E69AB]">{task.name}</div>
        <div className="text-sm text-[#8E9196]">
          Создано: {format(new Date(task.created_at), "PPp")}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <TaskStatusBadge status={task.status} />
      </div>
    </div>
  );
}
