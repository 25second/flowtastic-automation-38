import { FlowNode } from '@/types/flow';
import { DatabaseIcon, TableIcon, Search } from 'lucide-react';

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
  },
  {
    type: 'web-search-table',
    label: 'Web Search with Table',
    description: 'Search the web and store results in a table',
    icon: Search,
    settings: {
      tableName: '',
      query: '',
      selectedOutputs: ['searchResults', 'tableWriteResult']
    },
    outputs: [
      { id: 'searchResults', label: 'Search Results' },
      { id: 'tableWriteResult', label: 'Table Write Result' }
    ],
    color: '#22c55e'
  }
];
