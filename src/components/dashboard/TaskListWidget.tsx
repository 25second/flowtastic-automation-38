
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Task } from "@/types/task";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";
import { DateRangePicker } from "../admin/dashboard/DateRangePicker";
import { DateRangeFilter } from "@/hooks/useAdminStats";
import { Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function TaskListWidget() {
  const { session } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
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

      const formattedTasks: Task[] = data.map(task => ({
        ...task,
        browser_sessions: Array.isArray(task.browser_sessions) 
          ? task.browser_sessions.map((session: any) => ({
              id: String(session.id || ''),
              type: (session.type as 'browser' | 'session') || 'session',
              port: typeof session.port === 'number' ? session.port : undefined,
              status: typeof session.status === 'string' ? session.status : undefined
            }))
          : []
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Task status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { 
          icon: <Clock className="h-3 w-3 mr-1" />, 
          style: "bg-[#F2FCE2] text-green-700 hover:bg-[#E2ECE2]"
        };
      case "in_process":
        return { 
          icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />, 
          style: "bg-orange-100 text-orange-700 hover:bg-orange-200"
        };
      case "done":
        return { 
          icon: <CheckCircle2 className="h-3 w-3 mr-1" />, 
          style: "bg-[#D3E4FD] text-blue-700 hover:bg-[#C3D4ED]"
        };
      case "error":
        return { 
          icon: <AlertCircle className="h-3 w-3 mr-1" />, 
          style: "bg-red-100 text-red-700 hover:bg-red-200"
        };
      default:
        return { 
          icon: <Clock className="h-3 w-3 mr-1" />, 
          style: "bg-gray-100 text-gray-700 hover:bg-gray-200"
        };
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Последние задачи</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {["pending", "in_process", "done", "error"].map((status) => {
              const { icon, style } = getStatusBadge(status);
              return (
                <Badge 
                  key={status}
                  className={`cursor-pointer flex items-center ${style} ${selectedStatus === status ? 'ring-2 ring-offset-1' : ''}`}
                  onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                >
                  {icon}
                  {status === "pending" ? "Ожидает" : 
                   status === "in_process" ? "В процессе" : 
                   status === "done" ? "Выполнено" : 
                   status === "error" ? "Ошибка" : status}
                </Badge>
              );
            })}
          </div>
          <DateRangePicker 
            dateRange={dateRange}
            onChange={setDateRange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => {
              const { icon, style } = getStatusBadge(task.status);
              return (
                <div key={task.id} className="p-3 border rounded-lg flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium">{task.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Создано: {format(new Date(task.created_at), "PPp")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${style} flex items-center`}>
                      {icon} 
                      {task.status === "pending" ? "Ожидает" : 
                      task.status === "in_process" ? "В процессе" : 
                      task.status === "done" ? "Выполнено" : 
                      task.status === "error" ? "Ошибка" : task.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Нет задач
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button asChild size="sm" variant="outline">
            <Link to="/bot-launch">Все задачи</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
