
import { FlowNode } from '@/types/flow';
import { DatabaseIcon, TableIcon } from 'lucide-react';

export const tableNodes: FlowNode[] = [
  {
    type: 'read-table',
    label: 'Read Table',
    description: 'Read data from a custom table',
    icon: DatabaseIcon,
    settings: {
      tableName: '',
      columnName: '',
      readMode: 'sequential',
      filter: [],
      limit: 100,
      offset: 0,
      selectedOutputs: ['data']
    },
    outputs: [
      { id: 'data', label: 'Data' },
      { id: 'columns', label: 'Columns' },
      { id: 'rowCount', label: 'Row Count' }
    ],
    color: '#22c55e'
  },
  {
    type: 'write-table',
    label: 'Write Table',
    description: 'Write data to a custom table',
    icon: TableIcon,
    settings: {
      tableName: '',
      data: '[]',
      writeMode: 'overwrite', // 'overwrite' or 'append'
      selectedOutputs: ['success']
    },
    outputs: [
      { id: 'success', label: 'Success' },
      { id: 'tableId', label: 'Table ID' }
    ],
    color: '#3b82f6'
  }
];
