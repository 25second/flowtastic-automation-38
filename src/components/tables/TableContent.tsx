
import { formatDate } from './utils/formatters';
import { Category } from '@/types/workflow';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableItem } from './TableItem';
import { CustomTable } from './types';

interface TableContentProps {
  tables: CustomTable[] | undefined;
  isLoading: boolean;
  categories: Category[];
  onDeleteTable: (id: string) => void;
}

export function TableContent({ 
  tables, 
  isLoading, 
  categories, 
  onDeleteTable 
}: TableContentProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableCaption>A list of your custom tables.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <input type="checkbox" className="rounded border-gray-300" />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Columns</TableHead>
          <TableHead>Rows</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tables?.map((table) => (
          <TableItem 
            key={table.id}
            table={table}
            onDelete={onDeleteTable}
            formatDate={formatDate}
            categoryName={categories.find(c => c.id === table.category)?.name}
          />
        ))}
      </TableBody>
    </Table>
  );
}
