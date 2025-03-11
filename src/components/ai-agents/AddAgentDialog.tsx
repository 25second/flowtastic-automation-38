
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { AgentFormFields } from './agent-dialog/AgentFormFields';
import { generateAgentScript } from '@/utils/agentScriptGenerator';

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
    }
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
      // Generate the browser-use script
      const scriptContent = generateAgentScript({
        name,
        description,
        taskDescription,
        takeScreenshots,
        selectedTable,
        color: selectedColor
      });
      
      // Generate tags array from the comma-separated string
      const tagsArray = tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Insert the agent into the database
      const { data, error } = await supabase
        .from('agents')
        .insert([
          {
            name,
            description,
            user_id: session.user.id,
            status: 'idle',
            task_description: taskDescription,
            color: selectedColor,
            tags: tagsArray.length > 0 ? tagsArray : null,
            table_id: selectedTable || null,
            take_screenshots: takeScreenshots,
            script: scriptContent
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
    setSelectedColor('#9b87f5');
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
