
import { format } from "date-fns";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2
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

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => {
          const status = getStatusDisplay(task.status);
          return (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.name}</TableCell>
              <TableCell>
                <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                  {status.icon}
                  {status.text}
                </div>
              </TableCell>
              <TableCell>
                {format(task.startTime, "PPp")}
              </TableCell>
              <TableCell>
                {task.endTime ? format(task.endTime, "PPp") : "-"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
