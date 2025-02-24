
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

      .handsontable td.current {
        background-color: hsla(var(--primary), 0.1);
      }

      .handsontable tr:hover td {
        background-color: hsl(var(--muted));
      }

      .handsontable .wtBorder.current {
        background-color: hsl(var(--primary)) !important;
      }

      .handsontable .wtBorder.area {
        background-color: hsl(var(--primary)) !important;
      }

      .handsontable .columnSorting:hover {
        color: hsl(var(--primary));
      }

      .wtHolder {
        height: 100% !important;
      }

      /* Стили для выделения */
      .handsontable .area {
        background-color: hsla(var(--primary), 0.1) !important;
      }
      
      .handsontable .area-selection {
        border: 2px solid hsl(var(--primary)) !important;
      }

      /* Стили для меню фильтрации и сортировки */
      .handsontable .htFiltersMenuCondition {
        background: hsl(var(--background));
        border-color: hsl(var(--border));
      }

      .handsontable .htFiltersMenuCondition .htUIInput {
        background-color: hsl(var(--background));
        border-color: hsl(var(--border));
        color: hsl(var(--foreground));
      }

      .handsontable .htFiltersMenuCondition .htUISelectButton {
        background-color: hsl(var(--background));
        border-color: hsl(var(--border));
        color: hsl(var(--foreground));
      }

      /* Стили для комментариев */
      .htCommentTextArea {
        background-color: hsl(var(--background));
        border-color: hsl(var(--border));
        color: hsl(var(--foreground));
      }

      /* Стили для выпадающего меню */
      .htDropdownMenu {
        background: hsl(var(--background));
        border-color: hsl(var(--border));
        color: hsl(var(--foreground));
      }

      .htDropdownMenu .htItemWrapper {
        color: hsl(var(--foreground));
      }

      .htDropdownMenu .htItemWrapper:hover {
        background: hsl(var(--accent));
      }
    `}
  </style>
);
