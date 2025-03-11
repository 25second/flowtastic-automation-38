
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bot } from 'lucide-react';
import { TaskDescriptionField } from './TaskDescriptionField';
import { TableSelector } from './TableSelector';
import { accentColors } from '@/constants/accentColors';
import { useState } from 'react';

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
    <div className="grid gap-3 py-2">
      {/* Agent Name & Color Selection */}
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-md flex items-center justify-center bg-primary/10">
          <div 
            className="h-10 w-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: selectedColor }}
          >
            <Bot className="h-5 w-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <Label htmlFor="agent-name" className="text-sm font-medium mb-1 block">Agent Name</Label>
          <Input
            id="agent-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter agent name"
            className="border border-input bg-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Color Selector */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Agent Color</Label>
        <div className="grid grid-cols-8 gap-2 mt-1">
          {accentColors.map((color) => (
            <button
              key={color.value}
              type="button"
              className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                selectedColor === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => setSelectedColor(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this agent does"
          className="min-h-[50px] border border-input resize-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Tags */}
      <div className="space-y-1">
        <Label htmlFor="tags" className="text-sm font-medium">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="monitoring, scraping, etc."
          className="border border-input focus-visible:ring-2 focus-visible:ring-ring"
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
      <div className="flex items-center space-x-3 mt-1">
        <Switch
          id="screenshots"
          checked={takeScreenshots}
          onCheckedChange={setTakeScreenshots}
          className="data-[state=checked]:bg-primary"
        />
        <Label htmlFor="screenshots" className="font-medium cursor-pointer">
          Record screenshots during execution
        </Label>
      </div>
    </div>
  );
}
