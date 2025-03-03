
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Node, Edge } from '@xyflow/react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useAccentColor } from '@/hooks/useAccentColor';
import { useUserRole } from '@/hooks/useUserRole';
import { ChatInput } from '@/components/dashboard/ChatInput';
import { toast } from 'sonner';
import { useState } from 'react';
import { BotIcon, Send, Plus } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { FavoritedWorkflows } from '@/components/dashboard/FavoritedWorkflows';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  // Apply accent color
  useAccentColor();
  const {
    role,
    loading: roleLoading
  } = useUserRole();
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    session
  } = useAuth();
  const navigate = useNavigate();
  
  const {
    workflows,
    isLoading,
    workflowName,
    setWorkflowDescription,
    saveWorkflow,
    deleteWorkflow,
    tags,
    setTags
  } = useWorkflowManager([] as Node[], [] as Edge[]);
  
  const handleChatSubmit = (message: string) => {
    setIsProcessing(true);

    // Simulate processing - in a real app this would call an API
    setTimeout(() => {
      toast.success(`Сообщение получено: ${message}`);
      setIsProcessing(false);
    }, 1500);
  };
  
  // Sample task suggestions buttons data
  const taskSuggestions = [
    "Зарегистрируй мне domain.com почту",
    "Зайди на сайт domain.com и добавь в корзину случайно 5-6 товаров",
    "Выпиши новую статистику по кампаниям в таблицу"
  ];
  
  return (
    <SidebarProvider>
      <div className="flex w-full overflow-hidden bg-background">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <DashboardHeader />
            
            {/* Task List Section */}
            <div className="mt-8 mb-6 bg-white rounded-lg border border-border shadow-sm">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Список задач</h2>
                <Button className="gap-2" size="sm">
                  <Plus className="h-4 w-4" />
                  Создать новый
                </Button>
              </div>
              <div className="p-6">
                {/* This section would contain task list items */}
                <div className="py-10 text-center text-muted-foreground">
                  У вас пока нет задач
                </div>
              </div>
            </div>
            
            {/* Chat and AI Assistant Section */}
            <div className="mt-12 space-y-6">
              {/* AI Assistant Greeting */}
              <div className="flex items-center gap-3">
                <div className="bg-green-50 rounded-full p-3">
                  <BotIcon className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold">Чем займёмся сегодня?</h2>
              </div>
              
              {/* Chat Input */}
              <div className="relative">
                <ChatInput 
                  onSubmit={handleChatSubmit}
                  isLoading={isProcessing}
                  placeholder="Опиши подробно задачу, которую требуется выполнить"
                  className="w-full py-5 pr-12 bg-white border-border"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Button size="icon" variant="ghost" className="text-green-500 h-9 w-9">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Task Suggestions */}
              <div className="flex flex-wrap gap-2">
                {taskSuggestions.map((task, index) => (
                  <button
                    key={index}
                    className="text-sm py-2 px-4 bg-white border border-border rounded-full hover:bg-gray-50"
                    onClick={() => handleChatSubmit(task)}
                  >
                    {task}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
