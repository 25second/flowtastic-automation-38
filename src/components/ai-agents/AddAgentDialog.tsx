
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { AgentFormFields } from './agent-dialog/AgentFormFields';

interface AddAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentAdded: () => void;
}

export function AddAgentDialog({ open, onOpenChange, onAgentAdded }: AddAgentDialogProps) {
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [takeScreenshots, setTakeScreenshots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultColor = '#9b87f5';
  const defaultIcon = 'Bot';

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('custom_tables')
        .select('id, name')
        .eq('user_id', session.user.id);
      
      if (error) {
        toast.error('Failed to load tables');
        return [];
      }
      
      return data;
    },
  });

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please provide a name for the agent');
      return;
    }

    if (!session?.user?.id) {
      toast.error('You must be logged in');
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { data, error } = await supabase
        .from('agents')
        .insert([
          {
            name,
            description,
            user_id: session.user.id,
            status: 'idle',
            icon: defaultIcon,
            color: defaultColor,
            tags: tagsArray,
            task_description: taskDescription,
            table_id: selectedTable !== 'none' ? selectedTable : null,
            take_screenshots: takeScreenshots,
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      toast.success('Agent created successfully');
      onAgentAdded();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Failed to create agent');
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border bg-background shadow-lg rounded-lg my-4">
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
          selectedColor={defaultColor}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          takeScreenshots={takeScreenshots}
          setTakeScreenshots={setTakeScreenshots}
          tables={tables}
          tablesLoading={tablesLoading}
        />

        <DialogFooter className="pt-4 gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="hover:bg-muted"
          >
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
