
import { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeData } from '@/types/flow';
import { SettingsDialog } from './node-settings/SettingsDialog';
import { NodeControls } from './node-components/NodeControls';
import { NodeHeader } from './node-components/NodeHeader';
import { NodeOutputs } from './node-components/NodeOutputs';
import { baseHandleStyle } from './node-utils/nodeStyles';

interface CustomNodeProps {
  data: FlowNodeData;
  id: string;
  selected: boolean;
}

const availableOutputs = [
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'middleName', label: 'Middle Name' },
  { id: 'fullName', label: 'Full Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'address', label: 'Address' },
  { id: 'streetAddress', label: 'Street Address' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'country', label: 'Country' },
  { id: 'zipCode', label: 'Zip Code' },
  { id: 'coordinates', label: 'Coordinates' },
  { id: 'timezone', label: 'Timezone' },
  { id: 'birthDate', label: 'Birth Date' },
  { id: 'age', label: 'Age' },
  { id: 'nationality', label: 'Nationality' },
  { id: 'occupation', label: 'Occupation' },
  { id: 'username', label: 'Username' },
  { id: 'password', label: 'Password' }
];

const CustomNode = ({ data, id, selected }: CustomNodeProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const { deleteElements, setNodes } = useReactFlow();

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  };

  const handleSettingChange = useCallback((nodeId: string, settings: Record<string, any>) => {
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
    'duration-200'
  ].join(' ');

  const style = {
    ...(isGeneratePerson ? { minHeight: '150px' } : {}),
    borderLeft: `4px solid ${data.color || '#9b87f5'}`
  };

  const generatePersonOutputs = isGeneratePerson 
    ? availableOutputs.filter(output => 
        !data.settings?.selectedOutputs || 
        data.settings.selectedOutputs.includes(output.id)
      )
    : undefined;

  return (
    <>
      <div 
        className={nodeClassNames} 
        style={style}
      >
        <NodeControls
          selected={selected}
          onSettingsClick={isStartScript || isStop ? undefined : handleSettingsClick}
          onDelete={handleDelete}
        />

        <div className="px-4 py-3">
          {!isStartScript && (
            <Handle
              type="target"
              position={Position.Left}
              style={baseHandleStyle}
              isValidConnection={() => true}
            />
          )}
          
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
          />
        </div>
      </div>
      
      {!isStartScript && !isStop && (
        <SettingsDialog 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          nodeId={id}
          nodeData={data}
          onSettingsChange={handleSettingChange}
          initialSettings={data.settings}
        />
      )}
    </>
  );
};

export { CustomNode };

export const nodeTypes = {
  'default': CustomNode,
  'input': CustomNode,
  'output': CustomNode,
  'generate-person': CustomNode,
  'start-script': CustomNode,
  'stop': CustomNode,
  'new-tab': CustomNode,
  'switch-tab': CustomNode,
  'wait-for-tab': CustomNode,
  'close-tab': CustomNode,
  'mouse-click': CustomNode,
  'mouse-click-modified': CustomNode,
  'mouse-double-click': CustomNode,
  'mouse-hover': CustomNode,
  'mouse-move': CustomNode,
  'mouse-drag-drop': CustomNode,
  'mouse-wheel': CustomNode
};
