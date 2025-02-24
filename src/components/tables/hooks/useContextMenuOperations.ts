
import { RefObject } from 'react';
import { toast } from 'sonner';

export interface SelectedCells {
  start: { row: number; col: number };
  end: { row: number; col: number };
}

export const useContextMenuOperations = (
  hotTableRef: RefObject<any>,
  selectedCells: SelectedCells | null
) => {
  const handleCopy = () => {
    if (hotTableRef.current) {
      hotTableRef.current.hotInstance.copyPaste.copy();
      toast.success('Скопировано');
    }
  };

  const handleCut = () => {
    if (hotTableRef.current) {
      hotTableRef.current.hotInstance.copyPaste.cut();
      toast.success('Вырезано');
    }
  };

  const handlePaste = () => {
    if (hotTableRef.current) {
      hotTableRef.current.hotInstance.copyPaste.paste();
    }
  };

  const handleDeleteCells = () => {
    if (hotTableRef.current && selectedCells) {
      const hot = hotTableRef.current.hotInstance;
      const { start, end } = selectedCells;
      
      for (let row = start.row; row <= end.row; row++) {
        for (let col = start.col; col <= end.col; col++) {
          hot.setDataAtCell(row, col, '');
        }
      }
      toast.success('Ячейки очищены');
    }
  };

  const handleInsertRowAbove = () => {
    if (hotTableRef.current && selectedCells) {
      const hot = hotTableRef.current.hotInstance;
      hot.alter('insert_row', selectedCells.start.row);
      toast.success('Строка добавлена');
    }
  };

  const handleInsertRowBelow = () => {
    if (hotTableRef.current && selectedCells) {
      const hot = hotTableRef.current.hotInstance;
      hot.alter('insert_row', selectedCells.end.row + 1);
      toast.success('Строка добавлена');
    }
  };

  const handleInsertColLeft = () => {
    if (hotTableRef.current && selectedCells) {
      const hot = hotTableRef.current.hotInstance;
      hot.alter('insert_col', selectedCells.start.col);
      toast.success('Колонка добавлена');
    }
  };

  const handleInsertColRight = () => {
    if (hotTableRef.current && selectedCells) {
      const hot = hotTableRef.current.hotInstance;
      hot.alter('insert_col', selectedCells.end.col + 1);
      toast.success('Колонка добавлена');
    }
  };

  const handleRemoveRow = () => {
    if (hotTableRef.current && selectedCells) {
      const hot = hotTableRef.current.hotInstance;
      hot.alter('remove_row', selectedCells.start.row, selectedCells.end.row - selectedCells.start.row + 1);
      toast.success('Строки удалены');
    }
  };

  const handleRemoveCol = () => {
    if (hotTableRef.current && selectedCells) {
      const hot = hotTableRef.current.hotInstance;
      hot.alter('remove_col', selectedCells.start.col, selectedCells.end.col - selectedCells.start.col + 1);
      toast.success('Колонки удалены');
    }
  };

  return {
    handleCopy,
    handleCut,
    handlePaste,
    handleDeleteCells,
    handleInsertRowAbove,
    handleInsertRowBelow,
    handleInsertColLeft,
    handleInsertColRight,
    handleRemoveRow,
    handleRemoveCol,
  };
};
