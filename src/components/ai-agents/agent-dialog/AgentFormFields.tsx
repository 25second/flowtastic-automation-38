
import { NameField } from './NameField';
import { DescriptionField } from './DescriptionField';
import { TagsField } from './TagsField';
import { TaskDescriptionField } from './TaskDescriptionField';
import { TableSelector } from './TableSelector';
import { ScreenshotToggle } from './ScreenshotToggle';

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
      {/* Agent Name & Icon */}
      <NameField
        name={name}
        setName={setName}
        selectedColor={selectedColor}
      />
      
      {/* Description */}
      <DescriptionField
        description={description}
        setDescription={setDescription}
      />

      {/* Tags */}
      <TagsField
        tags={tags}
        setTags={setTags}
      />

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
      <ScreenshotToggle
        takeScreenshots={takeScreenshots}
        setTakeScreenshots={setTakeScreenshots}
      />
    </div>
  );
}
