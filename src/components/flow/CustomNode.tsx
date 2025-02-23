import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { FlowNodeData } from '@/types/flow';
import { SettingsDialog } from './node-settings/SettingsDialog';
import { NodeControls } from './node-components/NodeControls';
import { NodeHeader } from './node-components/NodeHeader';
import { NodeOutputs } from './node-components/NodeOutputs';

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

const getSettingsHandlesCount = (settings: Record<string, any> | undefined) => {
  if (!settings) return 0;
  
  let count = 0;
  if ('selector' in settings) count++;
  if ('text' in settings) count++;
  if ('url' in settings) count++;
  if ('x' in settings || 'startX' in settings) count++;
  if ('y' in settings || 'startY' in settings) count++;
  if ('endX' in settings) count++;
  if ('endY' in settings) count++;
  if ('deltaX' in settings) count++;
  if ('deltaY' in settings) count++;
  
  return count;
};

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
    'duration-200'
  ].join(' ');

  const style = {
    minHeight: `${minHeight}px`,
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
  'mouse-wheel': CustomNode,
  'keyboard-type': CustomNode,
  'keyboard-press': CustomNode,
  'keyboard-down': CustomNode,
  'keyboard-shortcut': CustomNode,
  'keyboard-focus-type': CustomNode,
  'read-table': CustomNode,
  'write-table': CustomNode,
  'wait-timeout': CustomNode,
  'wait-element': CustomNode,
  'wait-element-hidden': CustomNode,
  'wait-function': CustomNode,
  'wait-navigation': CustomNode,
  'wait-load': CustomNode,
  'wait-network-idle': CustomNode,
  'wait-dom-loaded': CustomNode
};
