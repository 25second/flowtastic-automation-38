
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AgentFormFields } from './agent-dialog/AgentFormFields';
import { useAgentCreation } from '@/hooks/ai-agents/useAgentCreation';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    tablesLoading,
    categories,
    categoriesLoading
  } = useAgentCreation({ onAgentAdded, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col overflow-hidden p-6">
        <DialogHeader className="space-y-1.5 flex-shrink-0">
          <DialogTitle className="text-2xl font-semibold">Add New Agent</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create an agent to automate tasks for you
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 my-4 overflow-y-auto pr-2">
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
            categories={categories || []}
            categoriesLoading={categoriesLoading}
            selectedCategory={formState.selectedCategory}
            setSelectedCategory={(value) => updateFormField('selectedCategory', value)}
          />
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t gap-2 mt-2">
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
