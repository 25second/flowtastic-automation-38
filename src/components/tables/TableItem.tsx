import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Play, Pencil, FileText, Star, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomTable } from './types';
import { Link } from 'react-router-dom';
interface TableItemProps {
  table: CustomTable;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
  categoryName?: string;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}
export function TableItem({
  table,
  onDelete,
  formatDate,
  categoryName,
  onToggleFavorite
}: TableItemProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(table.id);
  };
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(table.id, !table.is_favorite);
    }
  };
  const tagsList = table.tags ? Array.isArray(table.tags) ? table.tags : [table.tags] : [];
  return <TableRow>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell>
        <Link to={`/tables/${table.id}`} className="font-medium hover:underline">
          {table.name}
        </Link>
        {table.description && <div className="text-xs text-muted-foreground">{table.description}</div>}
      </TableCell>
      <TableCell>{categoryName || '-'}</TableCell>
      <TableCell>{formatDate(table.created_at)}</TableCell>
      <TableCell>{formatDate(table.updated_at)}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {tagsList.map((tag, index) => <span key={index} className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs">
              {tag}
            </span>)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon">
            <Play className="h-4 w-4" />
          </Button>
          <Link to={`/tables/${table.id}`}>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <FileText className="h-4 w-4" />
          </Button>
          {onToggleFavorite}
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>;
}