
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { DateRangeFilter } from "@/hooks/useAdminStats";
import { TaskStatus } from "@/components/dashboard/TaskStatusBadge";
import { toast } from "sonner";

interface UseTaskFetchingProps {
  limit?: number;
  selectedStatus?: TaskStatus | null;
  dateRange?: DateRangeFilter;
}

export function useTaskFetching({ 
  limit = 5, 
  selectedStatus = null, 
  dateRange = { startDate: undefined, endDate: undefined } 
}: UseTaskFetchingProps = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    console.log("useTaskFetching: Starting fetch");
    fetchTasks();
    
    // Add a timeout to prevent infinite loading state
    const timer = setTimeout(() => {
      if (loading) {
        console.log("Force ending loading state after timeout");
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timer);
  }, [selectedStatus, dateRange.startDate, dateRange.endDate, limit]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching tasks with filters:", { 
        limit, 
        status: selectedStatus, 
        dateStart: dateRange.startDate, 
        dateEnd: dateRange.endDate 
      });
      
      // Build query
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

      // Apply limit if provided
      if (limit > 0) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        setError(error);
        toast.error("Ошибка загрузки задач");
        setTasks([]);
        return;
      }

      console.log("Tasks fetched from DB:", data?.length || 0);

      // Format data and handle possible null values
      const formattedTasks: Task[] = (data || []).map(task => ({
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
      console.log("Tasks successfully loaded:", formattedTasks.length);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error as Error);
      toast.error("Произошла ошибка при загрузке задач");
      // Set tasks to empty array to prevent UI errors
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks
  };
}
