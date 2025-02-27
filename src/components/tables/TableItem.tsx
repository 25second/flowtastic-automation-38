
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomTable } from './types';
import { TableCell, TableRow } from "@/components/ui/table";

interface TableItemProps {
  table: CustomTable;
  onDelete: (id: string) => Promise<void>;
  formatDate: (dateString: string) => string;
}

export function TableItem({ table, onDelete, formatDate }: TableItemProps) {
  const navigate = useNavigate();

  return (
    <TableRow key={table.id}>
      <TableCell className="font-medium">{table.name}</TableCell>
      <TableCell>{table.description}</TableCell>
      <TableCell>{table.columns.length}</TableCell>
      <TableCell>{table.data.length}</TableCell>
      <TableCell>{formatDate(table.created_at)}</TableCell>
      <TableCell>{formatDate(table.updated_at)}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(`/tables/${table.id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(`/tables/${table.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(table.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
