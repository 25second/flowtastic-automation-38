
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function TaskStatusChart() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['dashboard-tasks-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) throw error;
      return data as Task[];
    }
  });

  const getStatusData = () => {
    if (!tasks || tasks.length === 0) return [];
    
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).map(([name, value]) => ({
      name: getStatusLabel(name),
      value
    }));
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'В ожидании';
      case 'in_process': return 'В процессе';
      case 'done': return 'Завершено';
      case 'error': return 'Ошибка';
      default: return status;
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
  const statusData = getStatusData();

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Распределение задач по статусам</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">Загрузка данных...</p>
            </div>
          ) : statusData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">Нет данных</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} задач`, 'Количество']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
