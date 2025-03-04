
import { useTaskManagement } from "@/hooks/useTaskManagement";
import { TaskListView } from "./TaskListView";
import { TaskCategories } from "./categories/TaskCategories";
import { useTaskCategories } from "@/hooks/useTasks/useTaskCategories";

export function BotLaunchContent() {
  const taskManagement = useTaskManagement();
  const {
    categories,
    loading: categoriesLoading,
    selectedCategory,
    setSelectedCategory,
    addCategory,
    deleteCategory,
    editCategory
  } = useTaskCategories();

  // Фильтр задач по категории
  const filteredByCategory = taskManagement.filteredTasks.filter(task => {
    if (!selectedCategory) return true;
    return task.category === selectedCategory;
  });

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bot Launch</h1>
      </div>

      <TaskCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onEditCategory={editCategory}
        isLoading={categoriesLoading}
      />

      <TaskListView
        searchQuery={taskManagement.searchQuery}
        onSearchChange={taskManagement.setSearchQuery}
        isAddDialogOpen={taskManagement.isAddDialogOpen}
        setIsAddDialogOpen={taskManagement.setIsAddDialogOpen}
        selectedTasks={taskManagement.selectedTasks}
        filteredTasks={filteredByCategory}
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
