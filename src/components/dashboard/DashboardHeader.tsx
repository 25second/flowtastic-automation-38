
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, List, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { format } from "date-fns";

export function DashboardHeader() {
  const { session } = useAuth();

  const { data: startedWorkflows } = useQuery({
    queryKey: ['started-workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('name, created_at')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: queuedWorkflows } = useQuery({
    queryKey: ['queued-workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('name')
        .eq('user_id', session?.user?.id)
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  return (
    <div className="flex justify-between items-start mb-8">
      <h1 className="text-3xl font-bold">Панель управления</h1>
      
      <div className="flex items-start gap-6">
        {/* Started Workflows List */}
        <Card className="p-4 w-64">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Started Workflows</h3>
          </div>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {startedWorkflows?.map((workflow, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{workflow.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(workflow.created_at), 'MMM d, HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Queued Workflows List */}
        <Card className="p-4 w-64">
          <div className="flex items-center gap-2 mb-3">
            <List className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Workflow Queue</h3>
          </div>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {queuedWorkflows?.map((workflow, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span>{workflow.name}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Greeting */}
        <div className="flex items-center gap-2 px-4 py-2 bg-accent rounded-lg">
          <span className="text-lg font-medium">Hello 👋</span>
        </div>

        <SidebarTrigger />
      </div>
    </div>
  );
}
