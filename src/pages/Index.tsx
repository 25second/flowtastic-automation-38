import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sidebar } from '@/components/flow/Sidebar';
import { nodeTypes } from '@/components/flow/CustomNode';
import { initialNodes } from '@/components/flow/nodeConfig';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Load stored flow from localStorage or use initial state
const getInitialFlow = () => {
  const storedFlow = localStorage.getItem('workflow');
  if (storedFlow) {
    try {
      const { nodes, edges } = JSON.parse(storedFlow);
      return { nodes, edges };
    } catch (error) {
      console.error('Error loading workflow:', error);
      return { nodes: initialNodes, edges: [] };
    }
  }
  return { nodes: initialNodes, edges: [] };
};

const generateScript = (nodes: any[], edges: any[]) => {
  let script = `// Workflow Automation Script
async function runWorkflow() {
  try {
    console.log('Starting workflow execution...');
`;
  
  // Sort nodes based on connections to determine execution order
  const nodeMap = new Map(nodes.map(node => [node.id, { ...node, visited: false }]));
  const startNodes = nodes.filter(node => !edges.some(edge => edge.target === node.id));
  
  const processNode = (node: any) => {
    let nodeScript = '';
    
    switch (node.type) {
      case 'trigger-schedule':
        nodeScript = `
    // Schedule trigger
    const schedule = "${node.data.settings?.cronExpression || '* * * * *'}";
    console.log('Schedule would run at:', schedule);`;
        break;

      case 'trigger-event':
        nodeScript = `
    // Event trigger
    console.log('Waiting for event:', "${node.data.settings?.eventType}");
    await new Promise(resolve => setTimeout(resolve, ${node.data.settings?.delay || 0}));`;
        break;

      case 'tab-new':
        nodeScript = `
    // Open new tab
    const newTab = window.open("${node.data.settings?.url || ''}", "_blank");
    if (newTab) {
      console.log('New tab opened');
    } else {
      throw new Error('Popup was blocked. Please allow popups for this site.');
    }`;
        break;

      case 'tab-close':
        nodeScript = `
    // Close tab
    window.close();
    console.log('Tab closed');`;
        break;

      case 'tab-switch':
        nodeScript = `
    // Note: Cannot switch tabs from console
    console.log('Tab switching is not available in console mode');`;
        break;

      case 'page-click':
        nodeScript = `
    // Click element
    const clickElement = document.querySelector("${node.data.settings?.selector || ''}");
    if (clickElement) {
      clickElement.click();
      console.log('Clicked element:', "${node.data.settings?.selector}");
    } else {
      throw new Error('Element not found: ${node.data.settings?.selector}');
    }`;
        break;

      case 'page-type':
        nodeScript = `
    // Type text
    const typeElement = document.querySelector("${node.data.settings?.selector || ''}");
    if (typeElement) {
      typeElement.value = "${node.data.settings?.text || ''}";
      // Trigger input event
      typeElement.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('Typed text into:', "${node.data.settings?.selector}");
    } else {
      throw new Error('Element not found: ${node.data.settings?.selector}');
    }`;
        break;

      case 'page-scroll':
        nodeScript = `
    // Scroll page
    const scrollElement = "${node.data.settings?.selector}" ? 
      document.querySelector("${node.data.settings?.selector}") : 
      document.documentElement;
    if (scrollElement) {
      scrollElement.scrollIntoView({ 
        behavior: "${node.data.settings?.behavior || 'smooth'}"
      });
      console.log('Scrolled to:', "${node.data.settings?.selector || 'top'}");
    } else {
      throw new Error('Scroll target not found');
    }`;
        break;

      case 'js-execute':
        nodeScript = `
    // Execute JavaScript
    try {
      ${node.data.settings?.code || '// No code provided'}
      console.log('Custom JavaScript executed');
    } catch (error) {
      throw new Error('Code execution failed: ' + error.message);
    }`;
        break;

      case 'js-evaluate':
        nodeScript = `
    // Evaluate JavaScript expression
    try {
      const result = ${node.data.settings?.expression || ''};
      console.log('Expression result:', result);
    } catch (error) {
      throw new Error('Expression evaluation failed: ' + error.message);
    }`;
        break;

      case 'screenshot-full':
        nodeScript = `
    // Note: Screenshots are not available in console mode
    console.log('Screenshots are not available in console mode');`;
        break;

      case 'screenshot-element':
        nodeScript = `
    // Note: Screenshots are not available in console mode
    console.log('Screenshots are not available in console mode');`;
        break;

      case 'data-extract':
        nodeScript = `
    // Extract data
    const elements = document.querySelectorAll("${node.data.settings?.selector || ''}");
    if (elements.length === 0) {
      throw new Error('No elements found: ${node.data.settings?.selector}');
    }
    const extractedData = Array.from(elements).map(el => 
      "${node.data.settings?.attribute || 'text'}" === 'text' ? 
        el.textContent : 
        el.getAttribute("${node.data.settings?.attribute || ''}")
    );
    console.log('Extracted data:', extractedData);`;
        break;

      case 'data-save':
        nodeScript = `
    // Save data to file
    const saveData = ${JSON.stringify(node.data.settings?.data || {})};
    const blob = new Blob([JSON.stringify(saveData)], { 
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "${node.data.settings?.filename || 'data'}.${node.data.settings?.format || 'json'}";
    a.click();
    URL.revokeObjectURL(url);
    console.log('Data saved to file');`;
        break;

      case 'flow-if':
        nodeScript = `
    // Conditional branch
    if (${node.data.settings?.condition || 'true'}) {
      console.log('Condition met:', "${node.data.settings?.description || ''}");
    }`;
        break;

      case 'flow-loop':
        nodeScript = `
    // Loop
    for (let i = 0; i < ${node.data.settings?.times || 1}; i++) {
      console.log('Loop iteration:', i + 1);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Prevent too rapid execution
    }`;
        break;

      case 'flow-wait':
        nodeScript = `
    // Wait
    await new Promise(resolve => setTimeout(resolve, ${node.data.settings?.duration || 1000}));
    console.log('Waited for ${node.data.settings?.duration || 1000}ms');`;
        break;

      default:
        nodeScript = `
    // Unknown node type: ${node.type}
    console.log('Node settings:', ${JSON.stringify(node.data.settings)});`;
    }
    
    return nodeScript;
  };

  const traverse = (node: any) => {
    if (!node || nodeMap.get(node.id)?.visited) return;
    
    const currentNode = nodeMap.get(node.id);
    if (currentNode) {
      currentNode.visited = true;
      script += processNode(node);
      
      const connectedEdges = edges.filter(edge => edge.source === node.id);
      connectedEdges.forEach(edge => {
        const nextNode = nodes.find(n => n.id === edge.target);
        traverse(nextNode);
      });
    }
  };
  
  startNodes.forEach(traverse);
  
  script += `
  } catch (error) {
    console.error('Workflow error:', error);
    throw error;
  }
}

// Execute the workflow
runWorkflow().catch(error => {
  console.error('Workflow failed:', error);
});`;
  
  return script;
};

const Index = () => {
  const initialFlow = getInitialFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges);
  const [showScript, setShowScript] = useState(false);

  // Save flow to localStorage whenever nodes or edges change
  useEffect(() => {
    try {
      const flow = { nodes, edges };
      localStorage.setItem('workflow', JSON.stringify(flow));
      toast.success('Workflow saved');
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    }
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source === params.target) {
        toast.error("Cannot connect a node to itself");
        return;
      }
      setEdges((eds) => addEdge(params, eds));
      toast.success('Nodes connected');
    },
    [],
  );

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
    toast.success('Node added');
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar onDragStart={onDragStart} />
      <div className="flex-1 relative" onDragOver={onDragOver} onDrop={onDrop}>
        <div className="absolute top-4 right-4 z-10">
          <Button 
            onClick={() => setShowScript(true)}
            variant="secondary"
          >
            View Script
          </Button>
        </div>
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
            nodeColor={() => '#fff'}
            maskColor="rgb(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>

      <Dialog open={showScript} onOpenChange={setShowScript}>
        <DialogContent className="max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Generated Workflow Script</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {generateScript(nodes, edges)}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
