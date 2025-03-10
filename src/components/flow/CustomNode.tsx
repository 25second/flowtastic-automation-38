
import { useState, useCallback } from 'react';
import { useReactFlow, NodeProps, Node } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeWithData, NodeData } from '@/types/flow';
import { SettingsDialog } from './node-settings/SettingsDialog';
import { NodeControls } from './node-components/NodeControls';
import { NodeHeader } from './node-components/NodeHeader';
import { NodeOutputs } from './node-components/NodeOutputs';
import { availableOutputs } from './node-utils/availableOutputs';
import { getSettingsHandlesCount } from './node-utils/handleUtils';
import { getNodeTypes } from './node-types';
import { NoteNode } from './node-components/NoteNode';

type CustomNodeProps = {
  id: string;
  data: NodeData;
  selected?: boolean;
  dragging?: boolean;
};

export const CustomNode = ({
  id,
  data,
  selected,
  dragging
}: CustomNodeProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const { deleteElements, setNodes } = useReactFlow<FlowNodeWithData>();

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  };

  const handleSettingsChange = useCallback((nodeId: string, settings: Record<string, any>) => {
    setNodes(nds => nds.map(node => {
      if (node.id === nodeId) {
        const isMathNode = node.data.type?.startsWith('math-');
        const currentSettings = node.data.settings || {};
        const newSettings = isMathNode 
          ? { 
              ...settings,
              inputs: currentSettings.inputs,
              outputs: currentSettings.outputs
            }
          : settings;

        return {
          ...node,
          data: { 
            ...node.data, 
            settings: newSettings
          }
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
  const isAiAction = data.type === 'ai-action';
  const isStartScript = data.type === 'start-script';
  const isStop = data.type === 'stop';
  const isLinkenSphereStopSession = data.type === 'linken-sphere-stop-session';
  const isMathNode = data.type?.startsWith('math-');
  const isMouseNode = data.type?.startsWith('mouse-');
  const isKeyboardNode = data.type?.startsWith('keyboard-');

  const settingsHandlesCount = getSettingsHandlesCount(data.settings || {});
  const outputsCount = (isGeneratePerson || isAiAction) && data.settings?.selectedOutputs 
    ? data.settings.selectedOutputs.length 
    : 0;

  const mathNodeInputs = isMathNode && data.settings?.inputs 
    ? data.settings.inputs 
    : undefined;
  
  const mathNodeOutputs = isMathNode && data.settings?.outputs
    ? data.settings.outputs
    : undefined;

  const minHeight = Math.max(
    100,
    settingsHandlesCount * 28 + 60,
    outputsCount * 28 + 60,
    (mathNodeInputs?.length || 0) * 28 + 60,
    ((isMouseNode || isKeyboardNode) && data.settings?.inputs?.length ? data.settings.inputs.length * 28 + 100 : 0)
  );

  const nodeClassNames = [
    'group',
    'relative',
    'w-[200px]',
    selected ? 'shadow-lg ring-2 ring-orange-200' : 'shadow-sm hover:shadow-md',
    'transition-shadow duration-200',
    dragging ? 'dragging' : '',
  ].join(' ');

  const style = {
    minHeight: `${minHeight}px`,
    borderLeft: `4px solid ${isLinkenSphereStopSession ? '#DC2626' : (data.color || '#9b87f5')}`,
    opacity: 1 // Force full opacity for the node itself
  };

  const nodeOutputs = isGeneratePerson || isAiAction 
    ? availableOutputs.filter(output => 
        !data.settings?.selectedOutputs || 
        data.settings.selectedOutputs.includes(output.id)
      )
    : undefined;

  const showSettingsButton = !isStartScript && !isStop && !isLinkenSphereStopSession;

  const initialSettings = isMathNode
    ? {
        ...data.settings,
        inputs: undefined,
        outputs: undefined
      }
    : data.settings;

  return (
    <>
      <div 
        className={nodeClassNames} 
        style={style}
      >
        <NodeControls
          selected={!!selected}
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
            outputs={nodeOutputs}
            isStop={isStop || isLinkenSphereStopSession}
            settings={data.settings}
            isStartScript={isStartScript}
            mathInputs={mathNodeInputs}
            mathOutputs={mathNodeOutputs}
            type={data.type}
            showFlowPoints={!!data.showFlowPoints}
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
          initialSettings={initialSettings}
        />
      )}
    </>
  );
};

export const nodeTypes = {
  ...getNodeTypes(CustomNode),
  noteNode: NoteNode as unknown as React.ComponentType<NodeProps>,
};
