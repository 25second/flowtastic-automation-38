
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
  
  try {
    return (
      <div className="p-2 border border-[#F1F0FB] rounded-lg flex justify-between items-center bg-white hover:shadow-sm transition-shadow">
        <div className="flex items-center space-x-3 flex-1 overflow-hidden">
          <div className="min-w-0 flex-shrink">
            <div className="font-medium text-[#7E69AB] truncate max-w-[200px]">{task.name}</div>
            <div className="text-xs text-[#8E9196] whitespace-nowrap">
              {format(new Date(task.created_at), "dd.MM.yy HH:mm")}
            </div>
          </div>
        </div>
        <TaskStatusBadge status={task.status} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering TaskListItem:", error, task);
    return (
      <div className="p-2 border border-red-200 rounded-lg bg-red-50 text-red-600">
        Ошибка отображения задачи
      </div>
    );
  }
}
