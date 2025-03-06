
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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedStatus || "all"}
        onValueChange={onStatusChange}
      >
        <SelectTrigger className="w-[180px] bg-white border-[#F1F0FB]">
          <SelectValue placeholder={t('tasks.filterByStatus')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">{t('tasks.allStatuses')}</SelectItem>
            <SelectItem value="pending">{t('tasks.status.pending')}</SelectItem>
            <SelectItem value="in_process">{t('tasks.status.inProcess')}</SelectItem>
            <SelectItem value="done">{t('tasks.status.done')}</SelectItem>
            <SelectItem value="error">{t('tasks.status.error')}</SelectItem>
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
