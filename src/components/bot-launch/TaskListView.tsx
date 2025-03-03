
import React from "react";
import { toast } from "sonner";
import { TaskList } from "./TaskList";
import { TaskListHeader } from "./TaskListHeader";
import { BulkActions } from "./BulkActions";
import { AddTaskDialog } from "./AddTaskDialog";
import { Task } from "@/types/task";

interface TaskListViewProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  selectedTasks: Set<string>;
  filteredTasks: Task[];
  onSelectTask: (taskId: string) => void;
  onSelectAll: () => void;
  onStartTask: (taskId: string) => void;
  onStopTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onBulkStart: () => void;
  onBulkStop: () => void;
  onBulkDelete: () => void;
  fetchTasks: () => Promise<void>;
}

export function TaskListView({
  searchQuery,
  onSearchChange,
  isAddDialogOpen,
  setIsAddDialogOpen,
  selectedTasks,
  filteredTasks,
  onSelectTask,
  onSelectAll,
  onStartTask,
  onStopTask,
  onDeleteTask,
  onBulkStart,
  onBulkStop,
  onBulkDelete,
  fetchTasks
}: TaskListViewProps) {
  return (
    <>
      <TaskListHeader 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onAddTask={() => setIsAddDialogOpen(true)}
      />
      
      {selectedTasks.size > 0 && (
        <BulkActions
          onBulkStart={onBulkStart}
          onBulkStop={onBulkStop}
          onBulkDelete={onBulkDelete}
        />
      )}

      <TaskList 
        tasks={filteredTasks}
        selectedTasks={selectedTasks}
        onSelectTask={onSelectTask}
        onSelectAll={onSelectAll}
        onStartTask={onStartTask}
        onStopTask={onStopTask}
        onDeleteTask={onDeleteTask}
        onEditTask={(task) => toast.info("Edit functionality to be implemented")}
        onViewLogs={(taskId) => toast.info("View logs functionality to be implemented")}
      />
      
      <AddTaskDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={(taskName) => {
          setIsAddDialogOpen(false);
          fetchTasks();
        }}
      />
    </>
  );
}
