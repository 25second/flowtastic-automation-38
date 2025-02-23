
import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeData } from '@/types/flow';
import { SettingsDialog } from './node-settings/SettingsDialog';
import { NodeControls } from './node-components/NodeControls';
import { NodeHeader } from './node-components/NodeHeader';
import { NodeOutputs } from './node-components/NodeOutputs';
import { availableOutputs } from './node-utils/availableOutputs';
import { getSettingsHandlesCount } from './node-utils/handleUtils';
import { getNodeTypes } from './node-types';

interface CustomNodeProps {
  data: FlowNodeData;
  id: string;
  selected: boolean;
}

export const CustomNode = ({ data, id, selected }: CustomNodeProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const { deleteElements, setNodes } = useReactFlow();

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  };

  const handleSettingsChange = useCallback((nodeId: string, settings: Record<string, any>) => {
    setNodes(nds => nds.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: { ...node.data, settings }
        };
      }
      return node;
    }));
  }, [setNodes]);

  const handleSettingsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowSettings(true);
  };

  const isGeneratePerson = data.type === 'generate-person';
  const isStartScript = data.type === 'start-script';
  const isStop = data.type === 'stop';
  const isLinkenSphereStopSession = data.type === 'linken-sphere-stop-session';

  const settingsHandlesCount = getSettingsHandlesCount(data.settings);
  const outputsCount = isGeneratePerson && data.settings?.selectedOutputs 
    ? data.settings.selectedOutputs.length 
    : 0;

  const minHeight = Math.max(
    100,
    settingsHandlesCount * 28 + 60,
    outputsCount * 28 + 60
  );

  const nodeClassNames = [
    'group',
    'relative',
    'w-[200px]',
    'bg-white',
    'rounded-lg',
    'border',
    'border-gray-200',
    selected ? 'shadow-lg ring-2 ring-orange-200' : 'shadow-sm hover:shadow-md',
    'transition-shadow',
    'duration-200',
    isLinkenSphereStopSession ? 'border-l-4 border-l-red-500' : ''
  ].join(' ');

  const style = {
    minHeight: `${minHeight}px`,
    borderLeft: isLinkenSphereStopSession ? 'none' : `4px solid ${data.color || '#9b87f5'}`
  };

  const generatePersonOutputs = isGeneratePerson 
    ? availableOutputs.filter(output => 
        !data.settings?.selectedOutputs || 
        data.settings.selectedOutputs.includes(output.id)
      )
    : undefined;

  // Показываем кнопку настроек для всех нод, кроме специальных типов
  const showSettingsButton = !isStartScript && !isStop && !isLinkenSphereStopSession;

  return (
    <>
      <div 
        className={nodeClassNames} 
        style={style}
      >
        <NodeControls
          selected={selected}
          onSettingsClick={showSettingsButton ? handleSettingsClick : undefined}
          onDelete={handleDelete}
        />

        <div className="px-4 py-3">
          <NodeHeader
            label={data.label}
            icon={data.icon}
            description={data.description}
          />
          
          <NodeOutputs
            isGeneratePerson={isGeneratePerson}
            outputs={generatePersonOutputs}
            isStop={isStop}
            settings={data.settings}
            isStartScript={isStartScript}
          />
        </div>
      </div>
      
      {showSettingsButton && (
        <SettingsDialog 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          nodeId={id}
          nodeData={data}
          onSettingsChange={handleSettingsChange}
          initialSettings={data.settings}
        />
      )}
    </>
  );
};

export const nodeTypes = getNodeTypes(CustomNode);
