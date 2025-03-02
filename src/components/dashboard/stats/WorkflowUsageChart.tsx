
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function WorkflowUsageChart() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['dashboard-workflow-usage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('workflow_id')
        .not('workflow_id', 'is', null);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: workflowData, isLoading: isLoadingWorkflows } = useQuery({
    queryKey: ['dashboard-workflows-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('id, name');
      
      if (error) throw error;
      return data;
    },
    enabled: !isLoading && !!tasks
  });

  const getWorkflowUsageData = () => {
    if (!tasks || !workflowData) return [];
    
    // Count workflow usage frequency
    const usageCounts = tasks.reduce((acc, task) => {
      if (task.workflow_id) {
        acc[task.workflow_id] = (acc[task.workflow_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    // Map to workflow names and sort by usage
    return Object.entries(usageCounts)
      .map(([id, count]) => {
        const workflow = workflowData.find(w => w.id === id);
        return {
          name: workflow ? (workflow.name.length > 15 ? workflow.name.substring(0, 15) + '...' : workflow.name) : 'Неизвестный',
          count
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Show top 5
  };

  const chartData = getWorkflowUsageData();
  const isLoadingData = isLoading || isLoadingWorkflows;

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Использование рабочих процессов</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {isLoadingData ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">Загрузка данных...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">Нет данных о использовании</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 65 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} запусков`, 'Количество']}
                  labelFormatter={(name) => `Workflow: ${name}`}
                />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
