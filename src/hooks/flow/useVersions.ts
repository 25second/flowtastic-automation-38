
import { useState, useCallback } from 'react';
import { Edge, NodeChange } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeWithData } from '@/types/flow';
import { WorkflowVersion, MAX_VERSIONS } from './types';

export const useVersions = (nodes: FlowNodeWithData[], edges: Edge[]) => {
  const [versions, setVersions] = useState<WorkflowVersion[]>([]);
  const [showVersions, setShowVersions] = useState(false);

  const isSignificantChange = (changes: NodeChange<FlowNodeWithData>[]) => {
    return changes.some(change => {
      switch (change.type) {
        case 'add':
        case 'remove':
          return true;
        case 'dimensions':
        case 'position':
          return false;
        case 'select':
          return change.selected === false;
        default:
          return false;
      }
    });
  };

  const saveVersion = useCallback(() => {
    try {
      const flow = { nodes, edges };
      localStorage.setItem('workflow', JSON.stringify(flow));

      const newVersion: WorkflowVersion = {
        timestamp: Date.now(),
        nodes: [...nodes],
        edges: [...edges]
      };

      const updatedVersions = [newVersion, ...versions].slice(0, MAX_VERSIONS);
      setVersions(updatedVersions);
      localStorage.setItem('workflow_versions', JSON.stringify(updatedVersions));
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    }
  }, [nodes, edges, versions]);

  const restoreVersion = useCallback((version: WorkflowVersion) => {
    try {
      localStorage.setItem('workflow', JSON.stringify({ nodes: version.nodes, edges: version.edges }));
      toast.success('Version restored');
      setShowVersions(false);
      return version;
    } catch (error) {
      console.error('Error restoring version:', error);
      toast.error('Failed to restore version');
      return null;
    }
  }, []);

  return {
    versions,
    setVersions,
    showVersions,
    setShowVersions,
    isSignificantChange,
    saveVersion,
    restoreVersion
  };
};
