import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { WorkflowList } from '@/components/workflow/WorkflowList';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Category } from '@/types/workflow';

interface DashboardContentProps {
  onEditDetails?: (workflow: any) => void;
  onRun?: (workflow: any) => void;
}

export const DashboardContent = ({ 
  onEditDetails,
  onRun,
}: DashboardContentProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { 
    workflows, 
    isLoading, 
    deleteWorkflow,
    refreshWorkflows,
  } = useWorkflowManager([], []);

  useEffect(() => {
    // Mock categories for now
    setCategories([
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
      { id: '3', name: 'Category 3' },
    ]);
  }, []);

  const handleDelete = (ids: string[]) => {
    ids.forEach(id => {
      deleteWorkflow.mutate(id, {
        onSuccess: () => {
          refreshWorkflows();
        },
      });
    });
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="hidden space-y-6 md:block">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Workflows</CardTitle>
            <CardDescription>
              All the workflows in your system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date</CardTitle>
            <CardDescription>
              The current date, select to change.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date > new Date() ||
                    date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
            <CardDescription>
              Search for workflows by name, description, or tags.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="search"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <WorkflowList
          isLoading={isLoading}
          workflows={workflows}
          onDelete={handleDelete}
          onEditDetails={onEditDetails}
          onRun={onRun}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};
