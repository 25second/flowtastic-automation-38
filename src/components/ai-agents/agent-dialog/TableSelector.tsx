
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface Table {
  id: string;
  name: string;
}

interface TableSelectorProps {
  tables?: Table[];
  isLoading: boolean;
  selectedTable: string;
  onTableChange: (value: string) => void;
}

export function TableSelector({ 
  tables = [], 
  isLoading, 
  selectedTable, 
  onTableChange 
}: TableSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="table-selection">Data Table</Label>
      <Select 
        value={selectedTable} 
        onValueChange={onTableChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a table to work with" />
        </SelectTrigger>
        <SelectContent>
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
  );
}
