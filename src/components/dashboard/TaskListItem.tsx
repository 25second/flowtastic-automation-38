
import { format } from "date-fns";
import { Task } from "@/types/task";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { Button } from "../ui/button";
import { Eye, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TaskListItemProps {
  task: Task;
  onViewLogs?: (taskId: string) => void;
  onRestartTask?: (taskId: string) => void;
}

export function TaskListItem({ task, onViewLogs, onRestartTask }: TaskListItemProps) {
  const [workflowName, setWorkflowName] = useState<string>("");
  
  useEffect(() => {
    // Fetch workflow information if workflow_id exists
    if (task.workflow_id) {
      const fetchWorkflow = async () => {
        try {
          const { data, error } = await supabase
            .from('workflows')
            .select('name')
            .eq('id', task.workflow_id)
            .single();
            
          if (error) {
            console.error("Error fetching workflow:", error);
            return;
          }
          
          if (data) {
            setWorkflowName(data.name);
          }
        } catch (err) {
          console.error("Error in workflow fetch:", err);
        }
      };
      
      fetchWorkflow();
    }
  }, [task.workflow_id]);
  
  if (!task) {
    console.error("TaskListItem received null task");
    return null;
  }
  
  console.log("Rendering task item:", task.id, task.name);
  
  const handleViewLogs = () => {
    if (onViewLogs) {
      onViewLogs(task.id);
    }
  };

  const handleRestart = () => {
    if (onRestartTask) {
      onRestartTask(task.id);
    }
  };
  
  try {
    return (
      <div className="py-2 px-4 border rounded-lg flex items-center justify-between bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center flex-1 overflow-hidden">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <div className="font-medium text-[#7E69AB] truncate">{task.name}</div>
              <div className="text-xs text-[#8E9196] whitespace-nowrap">
                {format(new Date(task.created_at), "dd.MM.yy HH:mm")}
              </div>
            </div>
            {workflowName && (
              <div className="text-xs text-[#8E9196] mt-0.5 truncate">
                Воркфлоу: {workflowName}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={handleViewLogs}
            title="Просмотр логов"
          >
            <Eye className="h-4 w-4 text-[#7E69AB]" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={handleRestart}
            title="Перезапустить задачу"
          >
            <RefreshCw className="h-4 w-4 text-[#7E69AB]" />
          </Button>
          <TaskStatusBadge status={task.status} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering TaskListItem:", error, task);
    return (
      <div className="p-2 border border-red-200 rounded-lg bg-red-50 text-red-600">
        Ошибка отображения задачи
      </div>
    );
  }
}
