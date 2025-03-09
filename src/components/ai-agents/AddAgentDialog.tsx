
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Check,
  Bot,
  User,
  Users,
  Target,
  Flag,
  Star,
  Heart,
  Award,
  Bookmark,
  Lightbulb,
  Monitor,
  Server,
  Database,
  Cpu,
  Code,
  Terminal,
  Key,
  Shield,
  UserCog,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';

interface AddAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentAdded: () => void;
}

// Icon options for agent
const iconOptions = [
  { name: 'Bot', component: Bot },
  { name: 'User', component: User },
  { name: 'Users', component: Users },
  { name: 'Target', component: Target },
  { name: 'Flag', component: Flag },
  { name: 'Star', component: Star },
  { name: 'Heart', component: Heart },
  { name: 'Award', component: Award },
  { name: 'Bookmark', component: Bookmark },
  { name: 'Lightbulb', component: Lightbulb },
  { name: 'Monitor', component: Monitor },
  { name: 'Server', component: Server },
  { name: 'Database', component: Database },
  { name: 'CPU', component: Cpu },
  { name: 'Code', component: Code },
  { name: 'Terminal', component: Terminal },
  { name: 'Key', component: Key },
  { name: 'Shield', component: Shield },
  { name: 'UserCog', component: UserCog },
  { name: 'Default', component: Bot },
];

// Color options for agent
const colorOptions = [
  { name: 'Purple', value: '#9b87f5' },
  { name: 'Lavender', value: '#7E69AB' },
  { name: 'Indigo', value: '#6E59A5' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Fuchsia', value: '#D946EF' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Sky Blue', value: '#0EA5E9' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Blue', value: '#6366F1' },
];

export function AddAgentDialog({ open, onOpenChange, onAgentAdded }: AddAgentDialogProps) {
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Bot');
  const [selectedColor, setSelectedColor] = useState('#9b87f5');
  const [selectedTable, setSelectedTable] = useState('');
  const [takeScreenshots, setTakeScreenshots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user tables
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
            icon: selectedIcon,
            color: selectedColor,
            tags: tagsArray,
            task_description: taskDescription,
            table_id: selectedTable || null,
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
    setSelectedIcon('Bot');
    setSelectedColor('#9b87f5');
    setSelectedTable('');
    setTakeScreenshots(false);
  };

  // Example task descriptions for inspiration
  const exampleTasks = [
    "Monitor website for price changes and notify me",
    "Extract product information from a list of URLs",
    "Generate weekly reports from data in selected table",
    "Track competitor website changes"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
          <DialogDescription>
            Create an agent to automate tasks for you
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Agent Name & Icon Selection */}
          <div className="flex items-center gap-4">
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-10 w-10 p-0" 
                    style={{ backgroundColor: selectedColor }}
                  >
                    {(() => {
                      const IconComponent = iconOptions.find(option => option.name === selectedIcon)?.component || Bot;
                      return <IconComponent className="h-5 w-5 text-white" />;
                    })()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div>
                      <Label>Icon</Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {iconOptions.map((icon) => {
                          const Icon = icon.component;
                          return (
                            <Button
                              key={icon.name}
                              variant="outline"
                              className={`h-10 w-10 p-0 ${selectedIcon === icon.name ? 'border-2 border-primary' : ''}`}
                              onClick={() => setSelectedIcon(icon.name)}
                            >
                              <Icon className="h-5 w-5" />
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Color</Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {colorOptions.map((color) => (
                          <Button
                            key={color.name}
                            variant="outline"
                            className={`h-10 w-10 p-0 ${selectedColor === color.value ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setSelectedColor(color.value)}
                          >
                            {selectedColor === color.value && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="agent-name">Agent Name</Label>
              <Input
                id="agent-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter agent name"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this agent does"
              className="min-h-[60px]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="monitoring, scraping, etc."
            />
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="task-description">Task Description</Label>
            <Textarea
              id="task-description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Describe the task this agent will perform"
              className="min-h-[80px]"
            />
            <div className="text-sm text-muted-foreground mt-1">
              <p className="mb-1">Examples:</p>
              <ul className="list-disc pl-5 space-y-1">
                {exampleTasks.map((task, index) => (
                  <li key={index} className="text-xs cursor-pointer hover:text-primary" onClick={() => setTaskDescription(task)}>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Table Selection */}
          <div className="space-y-2">
            <Label htmlFor="table-selection">Data Table</Label>
            <Select 
              value={selectedTable} 
              onValueChange={setSelectedTable}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a table to work with" />
              </SelectTrigger>
              <SelectContent>
                {/* Fix: Use a non-empty value for the SelectItem */}
                <SelectItem value="none">None</SelectItem>
                {tables?.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select a table that the agent will use for data processing
            </p>
          </div>

          {/* Take Screenshots */}
          <div className="flex items-center space-x-2">
            <Switch
              id="screenshots"
              checked={takeScreenshots}
              onCheckedChange={setTakeScreenshots}
            />
            <Label htmlFor="screenshots">Record screenshots during execution</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !name.trim()}>
            {isSubmitting ? 'Creating...' : 'Create Agent'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

