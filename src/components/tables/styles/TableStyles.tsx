
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

      /* Selection styles */
      .handsontable .hot-current-row,
      .handsontable .hot-current-col,
      .handsontable .hot-current-header {
        background-color: hsla(var(--primary), 0.1) !important;
      }

      /* Active cell styles */
      .handsontable td.current,
      .handsontable td.area.current {
        background-color: hsla(var(--primary), 0.15) !important;
      }

      .handsontable tr:hover td {
        background-color: hsl(var(--muted));
      }

      /* Border styles for selection */
      .handsontable .wtBorder.current {
        background-color: hsl(var(--primary)) !important;
        border: 2px solid hsl(var(--primary)) !important;
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

      /* Area selection styles */
      .handsontable .area {
        background-color: hsla(var(--primary), 0.1) !important;
      }
      
      .handsontable .area-selection {
        border: 2px solid hsl(var(--primary)) !important;
      }

      /* Filter menu styles */
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

      /* Comment styles */
      .htCommentTextArea {
        background-color: hsl(var(--background));
        border-color: hsl(var(--border));
        color: hsl(var(--foreground));
      }

      /* Dropdown menu styles */
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
