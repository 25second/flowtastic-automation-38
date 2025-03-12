
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AgentFormFields } from './agent-dialog/AgentFormFields';
import { useAgentCreation } from '@/hooks/ai-agents/useAgentCreation';

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
  const {
    formState,
    updateFormField,
    isSubmitting,
    handleSubmit,
    tables,
    tablesLoading
  } = useAgentCreation({ onAgentAdded, onOpenChange });

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
          name={formState.name}
          setName={(value) => updateFormField('name', value)}
          description={formState.description}
          setDescription={(value) => updateFormField('description', value)}
          tags={formState.tags}
          setTags={(value) => updateFormField('tags', value)}
          taskDescription={formState.taskDescription}
          setTaskDescription={(value) => updateFormField('taskDescription', value)}
          selectedColor={formState.selectedColor}
          setSelectedColor={(value) => updateFormField('selectedColor', value)}
          selectedTable={formState.selectedTable}
          setSelectedTable={(value) => updateFormField('selectedTable', value)}
          takeScreenshots={formState.takeScreenshots}
          setTakeScreenshots={(value) => updateFormField('takeScreenshots', value)}
          tables={tables}
          tablesLoading={tablesLoading}
        />

        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="hover:bg-muted">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formState.name.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? 'Creating...' : 'Create Agent'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
