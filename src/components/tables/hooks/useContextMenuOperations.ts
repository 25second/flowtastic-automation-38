
import { RefObject } from 'react';
import { toast } from 'sonner';

export interface ContextMenuOperations {
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: () => void;
  handleDeleteCells: () => void;
  handleInsertRowAbove: () => void;
  handleInsertRowBelow: () => void;
  handleRemoveRow: () => void;
  handleInsertColLeft: () => void;
  handleInsertColRight: () => void;
  handleRemoveCol: () => void;
}

export const useContextMenuOperations = (
  hotTableRef: RefObject<any>,
  selectedCells: { start: { row: number; col: number }; end: { row: number; col: number } } | null
): ContextMenuOperations => {
  const getHotInstance = () => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) {
      console.warn('Handsontable instance not ready');
      return null;
    }
    return hot;
  };

  const handleCopy = () => {
    const hot = getHotInstance();
    if (hot && hot.copyPaste) {
      try {
        hot.copyPaste.copy();
        toast.success('Скопировано');
      } catch (error) {
        console.error('Copy failed:', error);
        toast.error('Не удалось скопировать');
      }
    }
  };

  const handleCut = () => {
    const hot = getHotInstance();
    if (hot && hot.copyPaste) {
      try {
        hot.copyPaste.cut();
        toast.success('Вырезано');
      } catch (error) {
        console.error('Cut failed:', error);
        toast.error('Не удалось вырезать');
      }
    }
  };

  const handlePaste = () => {
    const hot = getHotInstance();
    if (hot && hot.copyPaste) {
      try {
        hot.copyPaste.paste();
      } catch (error) {
        console.error('Paste failed:', error);
        toast.error('Не удалось вставить');
      }
    }
  };

  const handleDeleteCells = () => {
    const hot = getHotInstance();
    if (hot && selectedCells) {
      try {
        const { start, end } = selectedCells;
        for (let row = start.row; row <= end.row; row++) {
          for (let col = start.col; col <= end.col; col++) {
            hot.setDataAtCell(row, col, '');
          }
        }
        toast.success('Ячейки очищены');
      } catch (error) {
        console.error('Delete cells failed:', error);
        toast.error('Не удалось очистить ячейки');
      }
    }
  };

  const handleInsertRowAbove = () => {
    const hot = getHotInstance();
    if (hot && selectedCells) {
      try {
        hot.alter('insert_row', selectedCells.start.row);
        toast.success('Строка добавлена');
      } catch (error) {
        console.error('Insert row failed:', error);
        toast.error('Не удалось добавить строку');
      }
    }
  };

  const handleInsertRowBelow = () => {
    const hot = getHotInstance();
    if (hot && selectedCells) {
      try {
        hot.alter('insert_row', selectedCells.end.row + 1);
        toast.success('Строка добавлена');
      } catch (error) {
        console.error('Insert row failed:', error);
        toast.error('Не удалось добавить строку');
      }
    }
  };

  const handleRemoveRow = () => {
    const hot = getHotInstance();
    if (hot && selectedCells) {
      try {
        hot.alter('remove_row', selectedCells.start.row, selectedCells.end.row - selectedCells.start.row + 1);
        toast.success('Строки удалены');
      } catch (error) {
        console.error('Remove row failed:', error);
        toast.error('Не удалось удалить строки');
      }
    }
  };

  const handleInsertColLeft = () => {
    const hot = getHotInstance();
    if (hot && selectedCells) {
      try {
        hot.alter('insert_col', selectedCells.start.col);
        toast.success('Колонка добавлена');
      } catch (error) {
        console.error('Insert column failed:', error);
        toast.error('Не удалось добавить колонку');
      }
    }
  };

  const handleInsertColRight = () => {
    const hot = getHotInstance();
    if (hot && selectedCells) {
      try {
        hot.alter('insert_col', selectedCells.end.col + 1);
        toast.success('Колонка добавлена');
      } catch (error) {
        console.error('Insert column failed:', error);
        toast.error('Не удалось добавить колонку');
      }
    }
  };

  const handleRemoveCol = () => {
    const hot = getHotInstance();
    if (hot && selectedCells) {
      try {
        hot.alter('remove_col', selectedCells.start.col, selectedCells.end.col - selectedCells.start.col + 1);
        toast.success('Колонки удалены');
      } catch (error) {
        console.error('Remove column failed:', error);
        toast.error('Не удалось удалить колонки');
      }
    }
  };

  return {
    handleCopy,
    handleCut,
    handlePaste,
    handleDeleteCells,
    handleInsertRowAbove,
    handleInsertRowBelow,
    handleRemoveRow,
    handleInsertColLeft,
    handleInsertColRight,
    handleRemoveCol,
  };
};
