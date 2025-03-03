
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DateRangeFilter } from "@/hooks/useAdminStats";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { TaskListItem } from "./TaskListItem";
import { TaskFilters } from "./TaskFilters";
import { TaskStatus } from "./TaskStatusBadge";

export function TaskListWidget() {
  const { session } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: undefined,
    endDate: undefined
  });

  useEffect(() => {
    if (session?.user) {
      fetchTasks();
    }
  }, [session?.user, selectedStatus, dateRange]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply status filter if selected
      if (selectedStatus) {
        query = query.eq('status', selectedStatus);
      }

      // Apply date range filter if selected
      if (dateRange.startDate) {
        query = query.gte('created_at', dateRange.startDate.toISOString());
      }
      if (dateRange.endDate) {
        // Add one day to include the end date fully
        const endDatePlusOne = new Date(dateRange.endDate);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
        query = query.lt('created_at', endDatePlusOne.toISOString());
      }

      // Limit to 5 tasks for the widget
      query = query.limit(5);

      const { data, error } = await query;

      if (error) throw error;

      const formattedTasks: Task[] = data?.map(task => ({
        ...task,
        browser_sessions: Array.isArray(task.browser_sessions) 
          ? task.browser_sessions.map((session: any) => ({
              id: String(session.id || ''),
              type: (session.type as 'browser' | 'session') || 'session',
              port: typeof session.port === 'number' ? session.port : undefined,
              status: typeof session.status === 'string' ? session.status : undefined
            }))
          : []
      })) || [];

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as TaskStatus || null);
  };

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
        ) : tasks.length > 0 ? (
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
