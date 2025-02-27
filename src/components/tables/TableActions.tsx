
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateTableDialog } from './CreateTableDialog';

interface TableActionsProps {
  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;
  onCreateTable: (options: { name: string; description: string; columnCount: number }) => Promise<void>;
  onImportTable: (options: { name: string; description: string; file: File }) => Promise<void>;
}

export function TableActions({ 
  isCreating, 
  setIsCreating, 
  onCreateTable, 
  onImportTable 
}: TableActionsProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Tables</h1>
      <Button className="gap-2" onClick={() => setIsCreating(true)}>
        <Plus className="h-4 w-4" />
        New Table
      </Button>

      <CreateTableDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onCreateTable={onCreateTable}
        onImportTable={onImportTable}
      />
    </div>
  );
}
