
import { format } from "date-fns";
import type { Task } from "@/types/task";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useTaskStatus } from "./task-list/useTaskStatus";
import { TaskActions } from "./task-list/TaskActions";
import { TaskLogs } from "./task-list/TaskLogs";
import { useTaskLogs } from "./task-list/useTaskLogs";

interface TaskListProps {
  tasks: Task[];
  selectedTasks: Set<string>;
  onSelectTask: (taskId: string) => void;
  onSelectAll: () => void;
  onStartTask: (taskId: string) => void;
  onStopTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onViewLogs: (taskId: string) => void;
}

export function TaskList({ 
  tasks,
  selectedTasks,
  onSelectTask,
  onSelectAll,
  onStartTask,
  onStopTask,
  onDeleteTask,
  onEditTask,
  onViewLogs
}: TaskListProps) {
  const { selectedTaskLogs, handleViewLogs, closeLogs } = useTaskLogs();
  const isAllSelected = tasks.length > 0 && selectedTasks.size === tasks.length;

  const handleLogsClick = (task: Task) => {
    handleViewLogs(task);
    onViewLogs(task.id);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Task Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const status = useTaskStatus(task.status);
            const isSelected = selectedTasks.has(task.id);

            return (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => onSelectTask(task.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                    {status.icon}
                    {status.text}
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(task.created_at), "PPp")}
                </TableCell>
                <TableCell>
                  {task.updated_at ? format(new Date(task.updated_at), "PPp") : "-"}
                </TableCell>
                <TableCell>
                  <TaskActions
                    task={task}
                    onViewLogs={() => handleLogsClick(task)}
                    onStartTask={onStartTask}
                    onStopTask={onStopTask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TaskLogs
        selectedTaskLogs={selectedTaskLogs}
        onClose={closeLogs}
      />
    </>
  );
}
