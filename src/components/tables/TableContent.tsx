
import React from 'react';
import { HotTable } from '@handsontable/react';
import { TableContextMenu } from './TableContextMenu';
import { TableStyles } from './styles/TableStyles';
import { ContextMenuOperations } from './hooks/useContextMenuOperations';

interface TableContentProps {
  hotTableRef: React.RefObject<any>;
  settings: any;
  contextMenuOperations: ContextMenuOperations;
}

export const TableContent: React.FC<TableContentProps> = ({
  hotTableRef,
  settings,
  contextMenuOperations
}) => {
  return (
    <TableContextMenu 
      onCopy={contextMenuOperations.handleCopy}
      onCut={contextMenuOperations.handleCut}
      onPaste={contextMenuOperations.handlePaste}
      onDeleteCells={contextMenuOperations.handleDeleteCells}
      onInsertRowAbove={contextMenuOperations.handleInsertRowAbove}
      onInsertRowBelow={contextMenuOperations.handleInsertRowBelow}
      onRemoveRow={contextMenuOperations.handleRemoveRow}
      onInsertColLeft={contextMenuOperations.handleInsertColLeft}
      onInsertColRight={contextMenuOperations.handleInsertColRight}
      onRemoveCol={contextMenuOperations.handleRemoveCol}
    >
      <div className="h-full">
        <TableStyles />
        <HotTable settings={settings} ref={hotTableRef} />
      </div>
    </TableContextMenu>
  );
};
