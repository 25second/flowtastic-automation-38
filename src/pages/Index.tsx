
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sidebar } from '@/components/flow/Sidebar';
import { nodeTypes } from '@/components/flow/CustomNode';
import { initialNodes } from '@/components/flow/nodeConfig';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
{
  // Chrome Extension Manifest V3 required permissions:
  // {
  //   "permissions": [
  //     "tabs",
  //     "activeTab",
  //     "scripting",
  //     "storage"
  //   ],
  //   "host_permissions": [
  //     "<all_urls>"
  //   ]
  // }

  async function runWorkflow() {
    try {
      // Get current active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs || tabs.length === 0) {
        throw new Error('No active tab found');
      }
      const tab = tabs[0];
      
      // Execute in the context of the active tab
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async () => {
          console.log('Workflow started in tab:', document.title);
        }
      });
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
      console.log('Scheduled to run at:', schedule);`;
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
      const newTab = await chrome.tabs.create({ 
        url: "${node.data.settings?.url || ''}", 
        active: ${node.data.settings?.active || true}
      });
      console.log('New tab opened:', newTab.id);
      
      // Wait for the new tab to load
      await new Promise(resolve => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === newTab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve(undefined);
          }
        });
      });`;
        break;

      case 'tab-close':
        nodeScript = `
      // Close tab
      const closeType = "${node.data.settings?.closeType || 'current'}";
      if (closeType === 'current') {
        await chrome.tabs.remove(tab.id);
        console.log('Closed tab:', tab.id);
      }`;
        break;

      case 'tab-switch':
        nodeScript = `
      // Switch tab
      const tabIndex = ${node.data.settings?.tabIndex || 0};
      const allTabs = await chrome.tabs.query({});
      if (allTabs[tabIndex]) {
        await chrome.tabs.update(allTabs[tabIndex].id, { active: true });
        console.log('Switched to tab:', allTabs[tabIndex].id);
      }`;
        break;

      case 'page-click':
        nodeScript = `
      // Click element
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (selector) => {
          const element = document.querySelector(selector);
          if (element) {
            element.click();
            return true;
          }
          throw new Error('Element not found: ' + selector);
        },
        args: ["${node.data.settings?.selector || ''}"]
      });
      console.log('Clicked element:', "${node.data.settings?.selector}");`;
        break;

      case 'page-type':
        nodeScript = `
      // Type text
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (selector, text) => {
          const element = document.querySelector(selector);
          if (element) {
            element.value = text;
            return true;
          }
          throw new Error('Element not found: ' + selector);
        },
        args: ["${node.data.settings?.selector || ''}", "${node.data.settings?.text || ''}"]
      });
      console.log('Typed text into:', "${node.data.settings?.selector}");`;
        break;

      case 'page-scroll':
        nodeScript = `
      // Scroll page
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (selector, behavior) => {
          const element = selector ? document.querySelector(selector) : document.documentElement;
          if (element) {
            element.scrollIntoView({ behavior });
            return true;
          }
          throw new Error('Element not found: ' + selector);
        },
        args: ["${node.data.settings?.selector || ''}", "${node.data.settings?.behavior || 'smooth'}"]
      });
      console.log('Scrolled to:', "${node.data.settings?.selector || 'top'}");`;
        break;

      case 'js-execute':
        nodeScript = `
      // Execute JavaScript
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          try {
            ${node.data.settings?.code || '// No code provided'}
            return true;
          } catch (error) {
            throw new Error('Code execution failed: ' + error.message);
          }
        }
      });
      console.log('Executed custom JavaScript');`;
        break;

      case 'js-evaluate':
        nodeScript = `
      // Evaluate JavaScript expression
      const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          try {
            return ${node.data.settings?.expression || ''};
          } catch (error) {
            throw new Error('Expression evaluation failed: ' + error.message);
          }
        }
      });
      console.log('Evaluated expression result:', result);`;
        break;

      case 'screenshot-full':
        nodeScript = `
      // Take full page screenshot
      const screenshot = await chrome.tabs.captureVisibleTab(null, {
        format: "${node.data.settings?.format || 'png'}"
      });
      console.log('Screenshot taken:', screenshot);
      
      // Download the screenshot
      const link = document.createElement('a');
      link.href = screenshot;
      link.download = 'screenshot.' + "${node.data.settings?.format || 'png'}";
      link.click();`;
        break;

      case 'screenshot-element':
        nodeScript = `
      // Take element screenshot
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (selector) => {
          const element = document.querySelector(selector);
          if (!element) {
            throw new Error('Element not found: ' + selector);
          }
          // Note: This is a simplified version. For actual implementation,
          // you would need to use html2canvas or similar library
          console.log('Element screenshot of:', selector);
          return true;
        },
        args: ["${node.data.settings?.selector || ''}"]
      });`;
        break;

      case 'data-extract':
        nodeScript = `
      // Extract data
      const extractedData = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (selector, attribute) => {
          const elements = document.querySelectorAll(selector);
          if (elements.length === 0) {
            throw new Error('No elements found: ' + selector);
          }
          return Array.from(elements).map(el => 
            attribute === 'text' ? el.textContent : el.getAttribute(attribute)
          );
        },
        args: ["${node.data.settings?.selector || ''}", "${node.data.settings?.attribute || 'text'}"]
      });
      console.log('Extracted data:', extractedData);`;
        break;

      case 'data-save':
        nodeScript = `
      // Save data
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
  });
}`;
  
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
