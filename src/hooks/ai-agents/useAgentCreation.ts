
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateAgentScript } from '@/utils/agentScriptGenerator';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/auth/AuthProvider';

interface AgentCreationFormState {
  name: string;
  description: string;
  tags: string;
  taskDescription: string;
  selectedTable: string;
  takeScreenshots: boolean;
  selectedColor: string;
}

interface UseAgentCreationProps {
  onAgentAdded: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useAgentCreation({ onAgentAdded, onOpenChange }: UseAgentCreationProps) {
  const { session } = useAuth();
  const [formState, setFormState] = useState<AgentCreationFormState>({
    name: '',
    description: '',
    tags: '',
    taskDescription: '',
    selectedTable: '',
    takeScreenshots: false,
    selectedColor: '#9b87f5' // Default color still set but not shown in UI
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('custom_tables')
        .select('id, name')
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error('Failed to load tables:', error);
        toast.error('Failed to load tables');
        return [];
      }
      return data;
    }
  });

  const { data: defaultProvider } = useQuery({
    queryKey: ['default-ai-provider'],
    queryFn: async () => {
      try {
        const response = await supabase.functions.invoke('settings-api', {
          body: { action: 'default-provider' }
        });

        if (response.error) {
          console.error('Failed to load default AI provider from API:', response.error);
          return { provider: 'OpenAI', model: 'gpt-4o-mini' };
        }
        
        return response.data?.provider || { provider: 'OpenAI', model: 'gpt-4o-mini' };
      } catch (err) {
        console.error('Error fetching default AI provider:', err);
        return { provider: 'OpenAI', model: 'gpt-4o-mini' };
      }
    }
  });

  const updateFormField = (field: keyof AgentCreationFormState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormState({
      name: '',
      description: '',
      tags: '',
      taskDescription: '',
      selectedTable: '',
      takeScreenshots: false,
      selectedColor: '#9b87f5'
    });
  };

  const handleSubmit = async () => {
    if (!formState.name.trim()) {
      toast.error('Please provide a name for the agent');
      return;
    }

    if (!formState.taskDescription.trim()) {
      toast.error('Please provide a task description for the agent');
      return;
    }

    if (!session?.user?.id) {
      toast.error('You must be logged in');
      return;
    }

    setIsSubmitting(true);

    try {
      const aiProvider = defaultProvider?.provider || 'OpenAI';
      const aiModel = defaultProvider?.model || 'gpt-4o-mini';
      
      const scriptContent = generateAgentScript({
        name: formState.name,
        description: formState.description,
        taskDescription: formState.taskDescription,
        takeScreenshots: formState.takeScreenshots,
        selectedTable: formState.selectedTable,
        color: formState.selectedColor,
        aiProvider,
        model: aiModel
      });
      
      if (!scriptContent) {
        throw new Error('Failed to generate agent script');
      }

      console.log('Inserting agent with data:', {
        name: formState.name,
        description: formState.description,
        user_id: session.user.id,
        status: 'idle',
        task_description: formState.taskDescription,
        color: formState.selectedColor,
        table_id: formState.selectedTable || null,
        take_screenshots: formState.takeScreenshots,
        script: scriptContent,
        ai_provider: aiProvider,
        model: aiModel
      });

      const { data, error } = await supabase
        .from('agents')
        .insert([{
          name: formState.name,
          description: formState.description,
          user_id: session.user.id,
          status: 'idle',
          task_description: formState.taskDescription,
          color: formState.selectedColor,
          table_id: formState.selectedTable || null, // Используем table_id вместо category_id
          take_screenshots: formState.takeScreenshots,
          script: scriptContent,
          ai_provider: aiProvider,
          model: aiModel
        }])
        .select();

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message);
      }

      toast.success('Agent created successfully');
      onAgentAdded();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create agent');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState,
    updateFormField,
    isSubmitting,
    handleSubmit,
    tables,
    tablesLoading
  };
}
