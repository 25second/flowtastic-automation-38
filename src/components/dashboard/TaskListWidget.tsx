
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { DateRangeFilter } from "@/hooks/useAdminStats";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TaskListItem } from "./TaskListItem";
import { TaskFilters } from "./TaskFilters";
import { TaskStatus } from "./TaskStatusBadge";
import { useTaskFetching } from "@/hooks/useTaskFetching";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { useTaskExecution } from "@/hooks/useTaskExecution";
import { TaskLogs } from "../bot-launch/task-list/TaskLogs";
import { useTaskLogs } from "../bot-launch/task-list/useTaskLogs";
import { Task } from "@/types/task";

export function TaskListWidget() {
  const { session } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: undefined,
    endDate: undefined
  });
  const { selectedTaskLogs, handleViewLogs, closeLogs } = useTaskLogs();
  const { startTask } = useTaskExecution();
  const [currentPage, setCurrentPage] = useState(0);

  // Use our custom hook for fetching tasks
  const { tasks, loading, fetchTasks } = useTaskFetching({
    limit: 5,
    selectedStatus,
    dateRange
  });

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value === "all" ? null : value as TaskStatus);
  };

  // Handle viewing logs for a task
  const onViewLogs = (taskId: string) => {
    const task = tasks?.find(task => task.id === taskId);
    if (task) {
      handleViewLogs(task);
    }
  };

  // Handle restarting a task
  const onRestartTask = (taskId: string) => {
    const task = tasks?.find(task => task.id === taskId);
    if (task) {
      toast.promise(startTask(task), {
        loading: 'Перезапуск задачи...',
        success: 'Задача успешно перезапущена',
        error: 'Ошибка при перезапуске задачи'
      });
    }
  };

  const handleNextPage = () => {
    if (tasks && tasks.length > 0) {
      setCurrentPage((prev) => (prev + 1) % Math.ceil(tasks.length / 3));
    }
  };

  const handlePrevPage = () => {
    if (tasks && tasks.length > 0) {
      setCurrentPage((prev) => (prev === 0 ? Math.ceil(tasks.length / 3) - 1 : prev - 1));
    }
  };

  const getVisibleTasks = () => {
    if (!tasks) return [];
    const itemsPerPage = 3;
    const startIndex = currentPage * itemsPerPage;
    return tasks.slice(startIndex, startIndex + itemsPerPage);
  };

  const visibleTasks = getVisibleTasks();
  const totalPages = tasks ? Math.ceil(tasks.length / 3) : 0;

  console.log("TaskListWidget rendering, tasks:", tasks?.length || 0, "loading:", loading);

  return (
    <>
      <Card className="w-full shadow-sm border border-[#F1F0FB]">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b">
          <CardTitle className="text-xl font-semibold">Последние задачи</CardTitle>
          <TaskFilters
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
            </div>
          ) : tasks && tasks.length > 0 ? (
            <div className="space-y-4">
              <div className="grid gap-4">
                {visibleTasks.map((task) => (
                  <TaskListItem 
                    key={task.id} 
                    task={task} 
                    onViewLogs={onViewLogs}
                    onRestartTask={onRestartTask}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePrevPage}
                    className="p-2"
                    disabled={tasks.length <= 3}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleNextPage}
                    className="p-2"
                    disabled={tasks.length <= 3}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Нет задач</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/bot-launch">Создать задачу</Link>
              </Button>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button asChild size="sm" variant="outline" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white transition-colors">
              <Link to="/bot-launch">Все задачи</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <TaskLogs
        selectedTaskLogs={selectedTaskLogs}
        onClose={closeLogs}
      />
    </>
  );
}
