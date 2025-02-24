
import React from 'react';

export const TableStyles = () => (
  <style>
    {`
      .handsontable {
        font-family: var(--font-sans);
        color: hsl(var(--foreground));
        height: 100% !important;
      }
      
      .handsontable th {
        background-color: hsl(var(--muted));
        color: hsl(var(--muted-foreground));
        font-weight: 500;
      }

      .handsontable td {
        background-color: hsl(var(--background));
        border-color: hsl(var(--border));
      }

      /* Стили ячеек */
      .handsontable td.table-cell {
        padding: 8px;
        border: 1px solid hsl(var(--border));
      }

      /* Стили выделения */
      .handsontable td.current {
        background: hsla(var(--primary), 0.15) !important;
      }

      .handsontable td.area.current {
        background: hsla(var(--primary), 0.2) !important;
      }

      .handsontable .hot-current-row td,
      .handsontable .hot-current-col td {
        background: hsla(var(--primary), 0.1) !important;
      }

      /* Стили при наведении */
      .handsontable tbody tr:hover td {
        background: hsla(var(--muted), 0.5) !important;
      }

      /* Стили границ выделения */
      .handsontable .wtBorder.current,
      .handsontable .wtBorder.area {
        background-color: hsl(var(--primary)) !important;
      }

      .handsontable .wtBorder.current {
        border: 2px solid hsl(var(--primary)) !important;
      }

      /* Стили заголовков */
      .handsontable th.table-header {
        background-color: hsl(var(--muted));
        color: hsl(var(--muted-foreground));
        font-weight: 500;
        padding: 8px;
      }

      .handsontable .hot-current-header {
        background-color: hsla(var(--primary), 0.1) !important;
      }

      .wtHolder {
        height: 100% !important;
      }

      /* Стили выпадающего меню */
      .htDropdownMenu {
        background: hsl(var(--background));
        border: 1px solid hsl(var(--border));
        padding: 4px 0;
      }

      .htDropdownMenu .htItemWrapper {
        padding: 4px 8px;
        color: hsl(var(--foreground));
      }

      .htDropdownMenu .htItemWrapper:hover {
        background: hsl(var(--accent));
      }

      /* Стили для комментариев */
      .htCommentTextArea {
        background-color: hsl(var(--background));
        border: 1px solid hsl(var(--border));
        color: hsl(var(--foreground));
        padding: 8px;
      }
    `}
  </style>
);
