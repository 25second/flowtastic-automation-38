
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

interface TableColumnSettingProps {
  settingKey: string;
  value: string;
  tableName: string;
  onChange: (value: string) => void;
}

export const TableColumnSetting = ({ settingKey, value, tableName, onChange }: TableColumnSettingProps) => {
  const [columns, setColumns] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchColumns = async () => {
      if (!tableName) {
        setColumns([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('custom_tables')
          .select('columns')
          .eq('name', tableName)
          .single();
        
        if (error) throw error;
        
        setColumns(data.columns || []);
      } catch (error) {
        console.error('Error fetching columns:', error);
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
