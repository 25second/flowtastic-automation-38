
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Search, Settings } from 'lucide-react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: 'Start',
      settings: {
        description: '',
        timeout: 5000,
        retries: 3
      }
    },
    position: { x: 250, y: 25 },
    style: {
      background: '#fff',
      padding: '15px',
      borderRadius: '8px',
      width: 180,
    },
  },
];

const nodeCategories = [
  {
    name: 'Browser Actions',
    nodes: [
      { 
        type: 'browser-goto', 
        label: 'Go to URL', 
        description: 'Navigate to a specific URL', 
        settings: { url: '', timeout: 5000 },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
      { 
        type: 'browser-click', 
        label: 'Click Element', 
        description: 'Click on a page element', 
        settings: { selector: '', timeout: 5000 },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
      { 
        type: 'browser-input', 
        label: 'Fill Input', 
        description: 'Enter text into an input field', 
        settings: { selector: '', value: '', timeout: 5000 },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
    ]
  },
  {
    name: 'Data',
    nodes: [
      { 
        type: 'data-extract', 
        label: 'Extract Data', 
        description: 'Extract data from webpage', 
        settings: { selector: '', attribute: 'text' },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
      { 
        type: 'data-save', 
        label: 'Save Data', 
        description: 'Save extracted data', 
        settings: { filename: '', format: 'json' },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
    ]
  },
  {
    name: 'Flow Control',
    nodes: [
      { 
        type: 'flow-if', 
        label: 'If Condition', 
        description: 'Conditional branching', 
        settings: { condition: '' },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
      { 
        type: 'flow-loop', 
        label: 'Loop', 
        description: 'Repeat actions', 
        settings: { times: 1 },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
    ]
  }
];

const initialEdges = [];

const CustomNode = ({ data, id }: { data: any, id: string }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2 w-full">
        <span className="flex-1 text-sm font-medium">{data.label}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowSettings(true);
          }}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
      {data.description && (
        <div className="text-xs text-muted-foreground mt-1">
          {data.description}
        </div>
      )}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{data.label} Settings</DialogTitle>
            <DialogDescription>Configure the parameters for this node</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {Object.entries(data.settings || {}).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                <Input 
                  value={value as string} 
                  onChange={(e) => {
                    data.settings[key] = e.target.value;
                  }}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const nodeTypes = {
  'browser-goto': CustomNode,
  'browser-click': CustomNode,
  'browser-input': CustomNode,
  'data-extract': CustomNode,
  'data-save': CustomNode,
  'flow-if': CustomNode,
  'flow-loop': CustomNode,
  'input': CustomNode,
};

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchTerm, setSearchTerm] = useState('');

  const onConnect = (params: any) => setEdges((eds) => addEdge(params, eds));

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string, settings: any, description: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ 
      type: nodeType, 
      label: nodeLabel,
      settings: settings,
      description: description
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
    const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));

    if (!reactFlowBounds) return;

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode = {
      id: crypto.randomUUID(),
      type: data.type,
      position,
      data: { 
        label: data.label,
        settings: { ...data.settings },
        description: data.description
      },
      style: {
        background: '#fff',
        padding: '15px',
        borderRadius: '8px',
        width: 180,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const filteredCategories = nodeCategories.map(category => ({
    ...category,
    nodes: category.nodes.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.nodes.length > 0);

  return (
    <div className="flex h-screen w-full">
      <div className="w-64 border-r bg-background">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          {filteredCategories.map((category) => (
            <div key={category.name} className="p-4">
              <h2 className="mb-2 text-sm font-semibold">{category.name}</h2>
              {category.nodes.map((node) => (
                <div
                  key={node.type}
                  className={cn(
                    "mb-2 rounded-md border bg-card p-3 cursor-move hover:border-primary",
                    "transition-colors duration-200"
                  )}
                  draggable
                  onDragStart={(event) => onDragStart(event, node.type, node.label, node.settings, node.description)}
                >
                  <div className="text-sm font-medium">{node.label}</div>
                  <div className="text-xs text-muted-foreground">{node.description}</div>
                </div>
              ))}
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { strokeWidth: 2 },
            animated: true
          }}
        >
          <Background gap={15} size={1} />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              return '#fff';
            }}
            maskColor="rgb(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Index;
