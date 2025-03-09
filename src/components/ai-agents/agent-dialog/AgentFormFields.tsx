
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { IconColorSelector } from './IconColorSelector';
import { TaskDescriptionField } from './TaskDescriptionField';
import { TableSelector } from './TableSelector';

interface Table {
  id: string;
  name: string;
}

interface AgentFormFieldsProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  tags: string;
  setTags: (value: string) => void;
  taskDescription: string;
  setTaskDescription: (value: string) => void;
  selectedIcon: string;
  setSelectedIcon: (value: string) => void;
  selectedColor: string;
  setSelectedColor: (value: string) => void;
  selectedTable: string;
  setSelectedTable: (value: string) => void;
  takeScreenshots: boolean;
  setTakeScreenshots: (value: boolean) => void;
  tables?: Table[];
  tablesLoading: boolean;
}

export function AgentFormFields({
  name,
  setName,
  description,
  setDescription,
  tags,
  setTags,
  taskDescription,
  setTaskDescription,
  selectedIcon,
  setSelectedIcon,
  selectedColor,
  setSelectedColor,
  selectedTable,
  setSelectedTable,
  takeScreenshots,
  setTakeScreenshots,
  tables,
  tablesLoading
}: AgentFormFieldsProps) {
  return (
    <div className="grid gap-4 py-4">
      {/* Agent Name & Icon Selection */}
      <div className="flex items-center gap-4">
        <div>
          <IconColorSelector
            selectedIcon={selectedIcon}
            selectedColor={selectedColor}
            onIconChange={setSelectedIcon}
            onColorChange={setSelectedColor}
          />
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
      <TaskDescriptionField 
        value={taskDescription} 
        onChange={setTaskDescription} 
      />

      {/* Table Selection */}
      <TableSelector
        tables={tables}
        isLoading={tablesLoading}
        selectedTable={selectedTable}
        onTableChange={setSelectedTable}
      />

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
  );
}
