
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";

// Define the valid status types
type TaskStatus = "pending" | "in_process" | "done" | "error";

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

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending": return "Ожидает";
      case "in_process": return "В процессе";
      case "done": return "Выполнено";
      case "error": return "Ошибка";
      default: return status;
    }
  };

  return (
    <Card className="w-full shadow-md border border-[#F1F0FB]">
      <CardHeader className="flex flex-row items-center justify-between border-b border-[#F1F0FB] bg-[#FAFAFA]">
        <CardTitle className="text-xl text-[#7E69AB]">Последние задачи</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Select
              value={selectedStatus || ""}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px] bg-white border-[#F1F0FB]">
                <SelectValue placeholder="Фильтр по статусу" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="in_process">В процессе</SelectItem>
                  <SelectItem value="done">Выполнено</SelectItem>
                  <SelectItem value="error">Ошибка</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DateRangePicker 
            dateRange={dateRange}
            onChange={setDateRange}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => {
              const { icon, style } = getStatusBadge(task.status);
              return (
                <div key={task.id} className="p-3 border border-[#F1F0FB] rounded-lg flex justify-between items-center bg-white hover:shadow-sm transition-shadow">
                  <div className="flex-1">
                    <div className="font-medium text-[#7E69AB]">{task.name}</div>
                    <div className="text-sm text-[#8E9196]">
                      Создано: {format(new Date(task.created_at), "PPp")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${style} flex items-center`}>
                      {icon} 
                      {getStatusDisplay(task.status)}
                    </Badge>
                  </div>
                </div>
              );
            })}
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
