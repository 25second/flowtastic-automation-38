
import { FlowNode } from '@/types/flow';
import { DatabaseIcon, TableIcon } from 'lucide-react';

export const tableNodes: FlowNode[] = [
  {
    type: 'read-table',
    label: 'Read Table',
    description: 'Read data from a custom table',
    icon: DatabaseIcon,
    isStartScript: true,
    settings: {
      tableName: '',
      columnName: '',
      readMode: 'sequential',
      limit: 10,
      offset: 0,
      selectedOutputs: ['data']
    },
    outputs: [
      { id: 'data', label: 'Data' }
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
      data: '[]'
    },
    color: '#3b82f6'
  }
];
