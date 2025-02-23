
import { useState } from 'react';
import { ActiveCell } from '../types';

export const useTableSelection = () => {
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const [selection, setSelection] = useState<{ start: ActiveCell; end: ActiveCell } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleCellMouseDown = (row: number, col: number, value: any) => {
    setIsSelecting(true);
    setActiveCell({ row, col });
    setSelection({ start: { row, col }, end: { row, col } });
  };

  const handleCellMouseOver = (row: number, col: number) => {
    if (isSelecting && selection) {
      setSelection(prev => ({
        start: prev!.start,
        end: { row, col }
      }));
    }
  };

  const handleCellMouseUp = () => {
    setIsSelecting(false);
  };

  const handleCellClick = (row: number, col: number, value: any, isShiftKey: boolean = false) => {
    if (isShiftKey && activeCell) {
      setSelection({
        start: activeCell,
        end: { row, col }
      });
    } else if (!isSelecting) {
      setActiveCell({ row, col });
      setSelection(null);
    }
  };

  return {
    activeCell,
    setActiveCell,
    selection,
    setSelection,
    isSelecting,
    setIsSelecting,
    handleCellMouseDown,
    handleCellMouseOver,
    handleCellMouseUp,
    handleCellClick
  };
};
