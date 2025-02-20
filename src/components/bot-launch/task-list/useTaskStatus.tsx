
import { Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { Task } from "@/types/task";

export function useTaskStatus(status: Task["status"]) {
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
}
