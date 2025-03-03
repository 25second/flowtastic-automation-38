
import { Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";

// Define the valid status types
export type TaskStatus = "pending" | "in_process" | "done" | "error";

interface TaskStatusBadgeProps {
  status: string;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  // Get badge configuration based on status
  const { icon, style, label } = getStatusConfig(status);

  return (
    <Badge className={`${style} flex items-center`}>
      {icon}
      {label}
    </Badge>
  );
}

// Helper function to get badge configuration
export function getStatusConfig(status: string) {
  switch (status) {
    case "pending":
      return { 
        icon: <Clock className="h-3 w-3 mr-1" />, 
        style: "bg-[#F2FCE2] text-green-700 hover:bg-[#E2ECE2]",
        label: "Ожидает"
      };
    case "in_process":
      return { 
        icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />, 
        style: "bg-orange-100 text-orange-700 hover:bg-orange-200",
        label: "В процессе"
      };
    case "done":
      return { 
        icon: <CheckCircle2 className="h-3 w-3 mr-1" />, 
        style: "bg-[#D3E4FD] text-blue-700 hover:bg-[#C3D4ED]",
        label: "Выполнено"
      };
    case "error":
      return { 
        icon: <AlertCircle className="h-3 w-3 mr-1" />, 
        style: "bg-red-100 text-red-700 hover:bg-red-200",
        label: "Ошибка"
      };
    default:
      return { 
        icon: <Clock className="h-3 w-3 mr-1" />, 
        style: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        label: status
      };
  }
}
