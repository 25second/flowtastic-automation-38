
import { formatDate } from './utils/formatters';
import { Category } from '@/types/workflow';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableItem } from './TableItem';
import { CustomTable } from './types';
import { Checkbox } from "@/components/ui/checkbox";

interface TableContentProps {
  tables: CustomTable[] | undefined;
  isLoading: boolean;
  categories: Category[];
  onDeleteTable: (id: string) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export function TableContent({ 
  tables, 
  isLoading, 
  categories, 
  onDeleteTable,
  onToggleFavorite
}: TableContentProps) {
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
    </div>;
  }

  if (!tables || tables.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">No tables found. Create a new table to get started.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tables.map((table) => (
            <TableItem 
              key={table.id}
              table={table}
              onDelete={onDeleteTable}
              formatDate={formatDate}
              categoryName={categories.find(c => c.id === table.category)?.name}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
