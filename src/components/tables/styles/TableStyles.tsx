
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
      .handsontable .htCore td {
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
        border: 1px solid hsl(var(--border));
      }

      /* Стили выделения - важно! */
      .handsontable .htCore td.current,
      .handsontable .htCore td.highlight {
        background-color: hsla(var(--primary), 0.2) !important;
        color: hsl(var(--foreground));
      }

      .handsontable .htCore span.highlight {
        background-color: hsla(var(--primary), 0.2) !important;
      }

      .handsontable .htCore td.area,
      .handsontable .htCore td.area-highlighted {
        background-color: hsla(var(--primary), 0.15) !important;
      }

      /* Стили для выделенной строки/столбца */
      .handsontable .htCore tr.hot-current-row td,
      .handsontable .htCore .hot-current-col td {
        background-color: hsla(var(--primary), 0.1) !important;
      }

      /* Стили границ выделения */
      .handsontable .wtBorder.current,
      .handsontable .wtBorder.area,
      .handsontable .wtBorder.fill {
        background-color: hsl(var(--primary)) !important;
        border: 2px solid hsl(var(--primary)) !important;
        opacity: 1 !important;
      }

      .handsontable .wtBorder.corner {
        border: 2px solid hsl(var(--primary)) !important;
        background-color: hsl(var(--primary)) !important;
      }

      /* Стили при наведении */
      .handsontable .htCore tbody tr:hover td {
        background-color: hsla(var(--muted), 0.5) !important;
      }

      /* Стили заголовков */
      .handsontable .htCore th {
        background-color: hsl(var(--muted));
        color: hsl(var(--muted-foreground));
        font-weight: 500;
        padding: 8px;
      }

      .handsontable th.htCore.hot-current-header {
        background-color: hsla(var(--primary), 0.1) !important;
      }

      /* Общие стили */
      .wtHolder {
        height: 100% !important;
      }

      /* Стили выпадающего меню */
      .htDropdownMenu {
        background: hsl(var(--background));
        border: 1px solid hsl(var(--border));
        padding: 4px 0;
        z-index: 1000;
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
