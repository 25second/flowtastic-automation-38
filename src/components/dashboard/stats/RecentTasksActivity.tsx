
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task, BrowserSession } from "@/types/task";
import { format } from "date-fns";

export function RecentTasksActivity() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['dashboard-recent-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Transform browser_sessions from Json to BrowserSession[]
      return data.map(task => ({
        ...task,
        browser_sessions: (task.browser_sessions as unknown as BrowserSession[]) || []
      })) as Task[];
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">В ожидании</Badge>;
      case 'in_process':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">В процессе</Badge>;
      case 'done':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Завершено</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ошибка</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние активности</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Загрузка данных...</p>
        ) : !tasks || tasks.length === 0 ? (
          <p className="text-muted-foreground">Нет активностей</p>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="font-medium">{task.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Обновлено: {format(new Date(task.updated_at), 'dd.MM.yyyy HH:mm')}
                  </p>
                </div>
                {getStatusBadge(task.status)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
