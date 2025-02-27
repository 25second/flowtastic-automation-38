
import { nodeCategories } from '@/data/nodes';
import { FlowNodeWithData } from '@/types/flow';
import { WorkflowVersion, defaultNodeStyle } from './types';

// Find the start node configuration from nodeCategories
const startScriptNode = nodeCategories
  .find(category => category.name === "Basic")
  ?.nodes.find(node => node.type === 'start-script');

export const initialNodes: FlowNodeWithData[] = [{
  id: 'start',
  type: 'start-script',
  position: { x: 100, y: 100 },
  data: {
    type: 'start-script',
    label: startScriptNode?.label || 'Start Script',
    settings: startScriptNode?.settings || {},
    defaultSettings: startScriptNode?.settings || {},
    description: startScriptNode?.description || 'Start of workflow',
    color: '#3B82F6',
    icon: 'PlayCircle'
  },
  style: defaultNodeStyle,
}];

export const useInitialFlow = () => {
  const getInitialFlow = () => {
    const storedFlow = localStorage.getItem('workflow');
    const storedVersions = localStorage.getItem('workflow_versions');
    
    let initialVersions: WorkflowVersion[] = [];
    if (storedVersions) {
      try {
        initialVersions = JSON.parse(storedVersions);
      } catch (error) {
        console.error('Error loading versions:', error);
      }
    }

    if (storedFlow) {
      try {
        const { nodes, edges } = JSON.parse(storedFlow);
        // Ensure all nodes have their defaultSettings from nodeCategories
        const nodesWithDefaults = nodes.map((node: FlowNodeWithData) => {
          const nodeConfig = nodeCategories
            .flatMap(category => category.nodes)
            .find(n => n.type === node.type);
          
          if (nodeConfig) {
            return {
              ...node,
              data: {
                ...node.data,
                defaultSettings: nodeConfig.settings,
              }
            };
          }
          return node;
        });
        return { nodes: nodesWithDefaults, edges, versions: initialVersions };
      } catch (error) {
        console.error('Error loading workflow:', error);
        return { nodes: initialNodes, edges: [], versions: [] };
      }
    }
    return { nodes: initialNodes, edges: [], versions: [] };
  };

  return { getInitialFlow };
};
