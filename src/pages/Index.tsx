
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 25 },
  },
];

const nodeCategories = [
  {
    name: 'Browser Actions',
    nodes: [
      { type: 'browser-goto', label: 'Go to URL', description: 'Navigate to a specific URL' },
      { type: 'browser-click', label: 'Click Element', description: 'Click on a page element' },
      { type: 'browser-input', label: 'Fill Input', description: 'Enter text into an input field' },
    ]
  },
  {
    name: 'Data',
    nodes: [
      { type: 'data-extract', label: 'Extract Data', description: 'Extract data from webpage' },
      { type: 'data-save', label: 'Save Data', description: 'Save extracted data' },
    ]
  },
  {
    name: 'Flow Control',
    nodes: [
      { type: 'flow-if', label: 'If Condition', description: 'Conditional branching' },
      { type: 'flow-loop', label: 'Loop', description: 'Repeat actions' },
    ]
  }
];

const initialEdges = [];

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchTerm, setSearchTerm] = useState('');

  const onConnect = (params: any) => setEdges((eds) => addEdge(params, eds));

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label: nodeLabel }));
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
      data: { label: data.label },
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
                  onDragStart={(event) => onDragStart(event, node.type, node.label)}
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
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Index;
