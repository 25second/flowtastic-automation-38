
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, List } from "lucide-react";
import { AgentCreation } from "./AgentCreation";
import { TaskListView } from "./TaskListView";
import { useTaskManagement } from "@/hooks/useTaskManagement";

export function BotLaunchContent() {
  const [activeTab, setActiveTab] = useState<string>("task-list");
  const taskManagement = useTaskManagement();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bot Launch</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="ml-auto">
          <TabsList className="grid grid-cols-2 w-[300px]">
            <TabsTrigger value="agent-creation" className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              <span>Создание агента</span>
            </TabsTrigger>
            <TabsTrigger value="task-list" className="flex items-center gap-1">
              <List className="h-4 w-4" />
              <span>Список агентов</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "task-list" ? (
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
      ) : (
        <AgentCreation />
      )}
    </div>
  );
}
