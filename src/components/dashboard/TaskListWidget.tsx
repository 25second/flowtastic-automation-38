
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { DateRangeFilter } from "@/hooks/useAdminStats";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TaskListItem } from "./TaskListItem";
import { TaskFilters } from "./TaskFilters";
import { TaskStatus } from "./TaskStatusBadge";
import { useTaskFetching } from "@/hooks/useTaskFetching";

export function TaskListWidget() {
  const { session } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: undefined,
    endDate: undefined
  });

  // Use our custom hook for fetching tasks
  const { tasks, loading } = useTaskFetching({
    limit: 5,
    selectedStatus,
    dateRange
  });

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value === "all" ? null : value as TaskStatus);
  };

  console.log("TaskListWidget rendering, tasks:", tasks?.length || 0, "loading:", loading);

  return (
    <Card className="w-full shadow-md border border-[#F1F0FB]">
      <CardHeader className="flex flex-row items-center justify-between border-b border-[#F1F0FB] bg-[#FAFAFA]">
        <CardTitle className="text-xl text-[#7E69AB]">Последние задачи</CardTitle>
        <TaskFilters
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
          </div>
        ) : tasks && tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskListItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-[#8E9196]">
            Нет задач
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Button asChild size="sm" variant="outline" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white transition-colors">
            <Link to="/bot-launch">Все задачи</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
