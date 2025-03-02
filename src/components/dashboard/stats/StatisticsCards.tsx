
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, CircleX, Clock, GitBranch } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";

export function StatisticsCards() {
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['dashboard-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) throw error;
      return data as Task[];
    }
  });

  const { data: workflows, isLoading: isLoadingWorkflows } = useQuery({
    queryKey: ['dashboard-workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === 'done').length || 0;
  const errorTasks = tasks?.filter(task => task.status === 'error').length || 0;
  const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const activeTasks = tasks?.filter(task => task.status === 'in_process').length || 0;
  const totalWorkflows = workflows?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всего задач</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoadingTasks ? '...' : totalTasks}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {activeTasks > 0 ? `${activeTasks} активных в данный момент` : 'Нет активных задач'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Успешность выполнения</CardTitle>
          <CircleCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoadingTasks ? '...' : `${successRate}%`}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {completedTasks} успешно, {errorTasks} с ошибками
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всего рабочих процессов</CardTitle>
          <GitBranch className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoadingWorkflows ? '...' : totalWorkflows}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Доступно для запуска
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Статус системы</CardTitle>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-muted-foreground">Онлайн</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Готово к работе</div>
          <p className="text-xs text-muted-foreground mt-1">
            Все системы в норме
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
