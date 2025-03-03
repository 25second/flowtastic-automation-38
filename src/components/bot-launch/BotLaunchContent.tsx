
import { List } from "lucide-react";
import { TaskListView } from "./TaskListView";
import { useTaskManagement } from "@/hooks/useTaskManagement";

export function BotLaunchContent() {
  const taskManagement = useTaskManagement();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bot Launch</h1>
        
        <div className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-md bg-muted text-muted-foreground">
          <List className="h-4 w-4" />
          <span>Список агентов</span>
        </div>
      </div>

      <TaskListView
        searchQuery={taskManagement.searchQuery}
        onSearchChange={taskManagement.setSearchQuery}
        isAddDialogOpen={taskManagement.isAddDialogOpen}
        setIsAddDialogOpen={taskManagement.setIsAddDialogOpen}
        selectedTasks={taskManagement.selectedTasks}
        filteredTasks={taskManagement.filteredTasks}
        onSelectTask={taskManagement.handleSelectTask}
        onSelectAll={taskManagement.handleSelectAll}
        onStartTask={taskManagement.handleStartTask}
        onStopTask={taskManagement.handleStopTask}
        onDeleteTask={taskManagement.handleDeleteTask}
        onBulkStart={taskManagement.handleBulkStart}
        onBulkStop={taskManagement.handleBulkStop}
        onBulkDelete={taskManagement.handleBulkDelete}
        fetchTasks={taskManagement.fetchTasks}
      />
    </div>
  );
}
