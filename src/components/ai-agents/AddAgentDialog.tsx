
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { AgentFormFields } from './agent-dialog/AgentFormFields';
import { generateAgentScript } from '@/utils/agentScriptGenerator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AddAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentAdded: () => void;
}

export function AddAgentDialog({
  open,
  onOpenChange,
  onAgentAdded
}: AddAgentDialogProps) {
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [takeScreenshots, setTakeScreenshots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#9b87f5');
  const [selectedProvider, setSelectedProvider] = useState('OpenAI');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

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

  const { data: aiProviders, isLoading: providersLoading } = useQuery({
    queryKey: ['ai-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_providers')
        .select('*');
      
      if (error) {
        console.error('Failed to load AI providers:', error);
        toast.error('Failed to load AI providers');
        return [];
      }
      return data || [];
    },
    enabled: open
  });

  const getModelsForProvider = (provider: string) => {
    switch (provider) {
      case 'OpenAI':
        return [
          { value: 'gpt-4o-mini', label: 'GPT-4o-mini' },
          { value: 'gpt-4o', label: 'GPT-4o' }
        ];
      case 'Gemini':
        return [
          { value: 'gemini-pro', label: 'Gemini Pro' },
          { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' }
        ];
      case 'Anthropic':
        return [
          { value: 'claude-3-opus', label: 'Claude 3 Opus' },
          { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
          { value: 'claude-3-haiku', label: 'Claude 3 Haiku' }
        ];
      default:
        return [{ value: 'default', label: 'Default Model' }];
    }
  };

  useEffect(() => {
    // Reset model when provider changes
    const models = getModelsForProvider(selectedProvider);
    if (models.length > 0 && !models.some(m => m.value === selectedModel)) {
      setSelectedModel(models[0].value);
    }
  }, [selectedProvider]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please provide a name for the agent');
      return;
    }

    if (!taskDescription.trim()) {
      toast.error('Please provide a task description for the agent');
      return;
    }

    if (!session?.user?.id) {
      toast.error('You must be logged in');
      return;
    }

    setIsSubmitting(true);

    try {
      const scriptContent = generateAgentScript({
        name,
        description,
        taskDescription,
        takeScreenshots,
        selectedTable,
        color: selectedColor,
        aiProvider: selectedProvider,
        model: selectedModel
      });
      
      if (!scriptContent) {
        throw new Error('Failed to generate agent script');
      }

      console.log('Inserting agent with data:', {
        name,
        description,
        user_id: session.user.id,
        status: 'idle',
        task_description: taskDescription,
        color: selectedColor,
        category_id: selectedTable || null,
        take_screenshots: takeScreenshots,
        script: scriptContent,
        ai_provider: selectedProvider,
        model: selectedModel
      });

      const { data, error } = await supabase
        .from('agents')
        .insert([{
          name,
          description,
          user_id: session.user.id,
          status: 'idle',
          task_description: taskDescription,
          color: selectedColor,
          category_id: selectedTable || null,
          take_screenshots: takeScreenshots,
          script: scriptContent,
          ai_provider: selectedProvider,
          model: selectedModel
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

  const resetForm = () => {
    setName('');
    setDescription('');
    setTags('');
    setTaskDescription('');
    setSelectedTable('');
    setTakeScreenshots(false);
    setSelectedColor('#9b87f5');
    setSelectedProvider('OpenAI');
    setSelectedModel('gpt-4o-mini');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border bg-background shadow-lg rounded-lg my-0">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold">Add New Agent</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create an agent to automate tasks for you
          </DialogDescription>
        </DialogHeader>

        <AgentFormFields
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          tags={tags}
          setTags={setTags}
          taskDescription={taskDescription}
          setTaskDescription={setTaskDescription}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          takeScreenshots={takeScreenshots}
          setTakeScreenshots={setTakeScreenshots}
          tables={tables}
          tablesLoading={tablesLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="ai-provider">AI Provider</Label>
            <Select 
              value={selectedProvider} 
              onValueChange={setSelectedProvider}
            >
              <SelectTrigger id="ai-provider">
                <SelectValue placeholder="Select AI Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OpenAI">OpenAI</SelectItem>
                <SelectItem value="Gemini">Google Gemini</SelectItem>
                <SelectItem value="Anthropic">Anthropic</SelectItem>
                {aiProviders?.filter(p => p.is_custom).map(provider => (
                  <SelectItem key={provider.id} value={provider.name}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-model">AI Model</Label>
            <Select 
              value={selectedModel} 
              onValueChange={setSelectedModel}
            >
              <SelectTrigger id="ai-model">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {getModelsForProvider(selectedProvider).map(model => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="hover:bg-muted">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? 'Creating...' : 'Create Agent'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
