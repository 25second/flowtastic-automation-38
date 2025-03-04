
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/types/workflow";

interface TableActionsProps {
  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;
  onCreateTable: (data: { 
    name: string; 
    description: string; 
    columnCount: number;
    category?: string;
  }) => void;
  onImportTable: (data: { 
    name: string; 
    description: string; 
    file: File;
    category?: string;
  }) => void;
  categories?: Category[];
  selectedCategory?: string | null;
}

export function TableActions({ 
  isCreating, 
  setIsCreating, 
  onCreateTable, 
  onImportTable,
  categories = [],
  selectedCategory = null
}: TableActionsProps) {
  const [mode, setMode] = useState<'create' | 'import'>('create');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [columnCount, setColumnCount] = useState(3);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState(selectedCategory || '');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateTable = () => {
    if (!name.trim()) {
      toast.error('Table name is required');
      return;
    }

    if (mode === 'create') {
      if (columnCount < 1) {
        toast.error('Column count must be at least 1');
        return;
      }
      onCreateTable({ name, description, columnCount, category: category || undefined });
    } else {
      if (!file) {
        toast.error('File is required');
        return;
      }
      onImportTable({ name, description, file, category: category || undefined });
    }

    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      
      // If name is not set, use the file name without extension
      if (!name) {
        const fileName = e.target.files[0].name.split('.')[0];
        setName(fileName);
      }
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setColumnCount(3);
    setFile(null);
    setCategory(selectedCategory || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isCreating} onOpenChange={setIsCreating}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Table' : 'Import Table from File'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex space-x-2">
            <Button 
              variant={mode === 'create' ? "default" : "outline"} 
              onClick={() => setMode('create')}
              className="flex-1"
            >
              Create Empty
            </Button>
            <Button 
              variant={mode === 'import' ? "default" : "outline"} 
              onClick={() => setMode('import')}
              className="flex-1"
            >
              Import
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Table Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter table name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Enter description"
              rows={2}
            />
          </div>

          {mode === 'create' ? (
            <div className="grid gap-2">
              <Label htmlFor="columns">Number of Columns</Label>
              <Input 
                id="columns" 
                type="number" 
                min={1} 
                max={20} 
                value={columnCount} 
                onChange={(e) => setColumnCount(parseInt(e.target.value))}
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="file">Upload File</Label>
              <div className="flex items-center">
                <Input 
                  id="file" 
                  type="file" 
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {file ? file.name : 'Select File'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: XLSX, XLS, CSV
              </p>
            </div>
          )}

          {categories.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Select 
                value={category || ''}
                onValueChange={setCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsCreating(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateTable}>
            {mode === 'create' ? 'Create Table' : 'Import Table'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
