
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { DateRangeFilter } from "@/hooks/useAdminStats";
import { TaskStatus } from "@/components/dashboard/TaskStatusBadge";

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
  
  useEffect(() => {
    fetchTasks();
  }, [selectedStatus, dateRange.startDate, dateRange.endDate, limit]);

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

      // Apply limit if provided
      if (limit > 0) {
        query = query.limit(limit);
      }

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

  return {
    tasks,
    loading,
    fetchTasks
  };
}
