
import { FlowNode } from '@/types/flow';
import { DatabaseIcon, TableIcon } from 'lucide-react';

export const tableNodes: FlowNode[] = [
  {
    type: 'read-table',
    label: 'Read Table',
    description: 'Read data from a custom table',
    icon: DatabaseIcon,
    settings: {
      useSettingsPort: false,
      tableName: '',
      columnName: '',
      readMode: 'sequential', // 'sequential' или 'random'
      limit: 10,
      offset: 0
    },
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
