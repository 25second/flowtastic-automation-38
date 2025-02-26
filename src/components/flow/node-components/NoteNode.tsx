
import React, { useState, useCallback } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette } from 'lucide-react';
import { NodeData } from '@/types/flow';

// Define the structure for note data
interface NoteData {
  content: string;
  color: string;
}

interface NoteNodeProps extends NodeProps {
  data: NodeData & NoteData;
  selected?: boolean;
}

const colors = [
  'bg-yellow-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-pink-100',
  'bg-purple-100',
  'bg-orange-100'
];

export const NoteNode: React.FC<NoteNodeProps> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [content, setContent] = useState<string>(data.content || '');
  const [color, setColor] = useState<string>(data.color || 'bg-yellow-100');

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    data.content = content;
  }, [content, data]);

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const selectColor = (newColor: string) => {
    setColor(newColor);
    data.color = newColor;
    setShowColorPicker(false);
  };

  return (
    <>
      <NodeResizer 
        minWidth={200} 
        minHeight={100} 
        isVisible={selected} 
        lineClassName="border-2 border-primary rounded"
      />
      <Card className={`p-3 w-full h-full shadow-md ${color} relative`}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6"
          onClick={toggleColorPicker}
        >
          <Palette className="h-4 w-4" />
        </Button>
        
        {showColorPicker && (
          <div className="absolute top-8 right-1 bg-white rounded-md shadow-lg p-2 z-50 grid grid-cols-3 gap-1">
            {colors.map((colorOption) => (
              <div
                key={colorOption}
                className={`w-6 h-6 rounded cursor-pointer ${colorOption}`}
                onClick={() => selectColor(colorOption)}
              />
            ))}
          </div>
        )}

        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className="w-full h-full min-h-[80px] bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary/20 resize-none"
            placeholder="Введите текст заметки..."
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            className="w-full h-full min-h-[80px] whitespace-pre-wrap cursor-text"
          >
            {content || "Двойной клик для редактирования"}
          </div>
        )}
      </Card>
    </>
  );
};
