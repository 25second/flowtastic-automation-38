
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

interface TableSettingProps {
  settingKey: string;
  value: string;
  onChange: (value: string) => void;
}

export const TableSetting = ({ settingKey, value, onChange }: TableSettingProps) => {
  const [tables, setTables] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const { data, error } = await supabase
          .from('custom_tables')
          .select('id, name');
        
        if (error) throw error;
        setTables(data || []);
      } catch (error) {
        console.error('Error fetching tables:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor={settingKey}>Select Table</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a table..." />
        </SelectTrigger>
        <SelectContent>
          {tables.map((table) => (
            <SelectItem key={table.id} value={table.name}>
              {table.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
