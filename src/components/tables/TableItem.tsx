
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Eye, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CustomTable } from "./types";

interface TableItemProps {
  table: CustomTable;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
  categoryName?: string;
}

export function TableItem({ table, onDelete, formatDate, categoryName }: TableItemProps) {
  const columns = table.columns?.length || 0;
  const rows = table.data?.length || 0;

  return (
    <TableRow>
      <TableCell className="font-medium">{table.name}</TableCell>
      <TableCell>{table.description || '-'}</TableCell>
      <TableCell>{columns}</TableCell>
      <TableCell>{rows}</TableCell>
      <TableCell>{categoryName || '-'}</TableCell>
      <TableCell>{formatDate(table.created_at)}</TableCell>
      <TableCell>{formatDate(table.updated_at)}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/tables/${table.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/tables/${table.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
            onClick={() => onDelete(table.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
