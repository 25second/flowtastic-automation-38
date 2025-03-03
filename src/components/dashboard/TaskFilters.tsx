
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { DateRangePicker } from "../admin/dashboard/DateRangePicker";
import { DateRangeFilter } from "@/hooks/useAdminStats";
import { TaskStatus } from "./TaskStatusBadge";

interface TaskFiltersProps {
  selectedStatus: TaskStatus | null;
  onStatusChange: (value: string) => void;
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
}

export function TaskFilters({ 
  selectedStatus, 
  onStatusChange, 
  dateRange, 
  onDateRangeChange 
}: TaskFiltersProps) {
  console.log("TaskFilters rendering with status:", selectedStatus);
  
  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedStatus || "all"}
        onValueChange={onStatusChange}
      >
        <SelectTrigger className="w-[180px] bg-white border-[#F1F0FB]">
          <SelectValue placeholder="Фильтр по статусу" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="pending">Ожидает</SelectItem>
            <SelectItem value="in_process">В процессе</SelectItem>
            <SelectItem value="done">Выполнено</SelectItem>
            <SelectItem value="error">Ошибка</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <DateRangePicker 
        dateRange={dateRange}
        onChange={onDateRangeChange}
      />
    </div>
  );
}
