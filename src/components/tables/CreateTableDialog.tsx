
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as XLSX from 'xlsx';

interface CreateTableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTable: (data: {
    name: string;
    description: string;
    columnCount: number;
  }) => void;
  onImportTable: (data: {
    name: string;
    description: string;
    file: File;
  }) => void;
}

export function CreateTableDialog({
  isOpen,
  onClose,
  onCreateTable,
  onImportTable,
}: CreateTableDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [columnCount, setColumnCount] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    onCreateTable({ name, description, columnCount });
    resetForm();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onImportTable({
      name: name || file.name.split('.')[0],
      description,
      file,
    });
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setColumnCount(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      onClose();
      resetForm();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Table</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Manually</TabsTrigger>
            <TabsTrigger value="import">Import File</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4 pt-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="name">Table Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter table name"
                />
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter table description"
                />
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="columns">Number of Columns</Label>
                <Input
                  id="columns"
                  type="number"
                  min={1}
                  value={columnCount}
                  onChange={(e) => setColumnCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <Button onClick={handleCreate} className="w-full" disabled={!name}>
                Create Table
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-4 pt-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="import-name">Table Name (Optional)</Label>
                <Input
                  id="import-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Will use filename if not provided"
                />
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="import-description">Description (Optional)</Label>
                <Textarea
                  id="import-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter table description"
                />
              </div>

              <div className="grid w-full gap-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,.xlsx"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload XLSX or CSV file
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
