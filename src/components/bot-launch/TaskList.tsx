
import { format } from "date-fns";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Play,
  StopCircle,
  Trash,
  Edit,
  Terminal
} from "lucide-react";
import type { Task } from "@/types/task";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
  const getStatusDisplay = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "bg-[#F2FCE2] text-green-700",
          text: "Pending"
        };
      case "in_process":
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          color: "bg-orange-100 text-orange-700",
          text: "In Process"
        };
      case "done":
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          color: "bg-[#D3E4FD] text-blue-700",
          text: "Done"
        };
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "bg-red-100 text-red-700",
          text: "Error"
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "bg-gray-100 text-gray-700",
          text: status
        };
    }
  };

  const isAllSelected = tasks.length > 0 && selectedTasks.size === tasks.length;

  return (
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
          const status = getStatusDisplay(task.status);
          const isSelected = selectedTasks.has(task.id);
          const isRunning = task.status === "in_process";

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
                    onClick={() => onEditTask(task)}
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
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
