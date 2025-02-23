
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Column {
  id: string;
  name: string;
}

interface TableData {
  columns: Array<{
    id: string;
    name: string;
    type?: string;
  }>;
}

interface TableColumnSettingProps {
  settingKey: string;
  value: string;
  tableName: string;
  onChange: (value: string) => void;
}

export const TableColumnSetting = ({ settingKey, value, tableName, onChange }: TableColumnSettingProps) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchColumns = async () => {
      if (!tableName) {
        setColumns([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data: tableData, error } = await supabase
          .from('custom_tables')
          .select('columns')
          .eq('name', tableName)
          .single();
        
        if (error) throw error;
        
        // Ensure columns is an array before mapping
        const columnsArray = Array.isArray(tableData?.columns) ? tableData.columns : [];
        const columnsData = columnsArray.map((col) => ({
          id: col.id || crypto.randomUUID(),
          name: col.name
        }));
        
        setColumns(columnsData);
      } catch (error) {
        console.error('Error fetching columns:', error);
        setColumns([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColumns();
  }, [tableName]);

  return (
    <div className="space-y-2">
      <Label htmlFor={settingKey}>Select Column</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={isLoading || !tableName}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a column..." />
        </SelectTrigger>
        <SelectContent>
          {columns.map((column) => (
            <SelectItem key={column.id} value={column.name}>
              {column.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
