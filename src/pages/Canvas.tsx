import { WorkflowStateProvider } from "@/components/flow/WorkflowStateProvider";
import { FlowLayout } from "@/components/flow/FlowLayout";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useState, useRef, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { EyeIcon, PlayIcon, SaveIcon, SparklesIcon, VideoIcon, MinimizeIcon, MaximizeIcon, SendIcon, GripHorizontal, FileUpIcon, ClockIcon, Bot } from "lucide-react";
import { ScriptDialog } from "@/components/flow/ScriptDialog";
import { useServerState } from "@/hooks/useServerState";
import { SaveWorkflowDialog } from "@/components/flow/SaveWorkflowDialog";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import '@xyflow/react/dist/style.css';
import { WorkflowStartDialog } from "@/components/flow/WorkflowStartDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { convertPuppeteerToNodes } from '@/utils/puppeteerConverter';
import { generatePuppeteerScript, processWorkflowJson } from '@/utils/jsonToPuppeteer';
import { AIAgentsDialog } from "@/components/flow/AIAgentsDialog";
import { Agent } from "@/hooks/ai-agents/types";
import { FlowNodeWithData } from "@/types/flow";

const MIN_HEIGHT = 320;
const MAX_HEIGHT = 800;

const CanvasContent = () => {
  const [showScript, setShowScript] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatHeight, setChatHeight] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [showAIAgentsDialog, setShowAIAgentsDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const existingWorkflow = location.state?.workflow;

  const [chatMessages, setChatMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>([{
    role: 'assistant',
    content: "Hello! I'm your AI assistant. How can I help you with your workflow today?"
  }]);
  const [currentMessage, setCurrentMessage] = useState('');
  const {
    startRecording,
    stopRecording,
    selectedBrowser,
    startWorkflow,
    selectedServer,
    serverToken
  } = useServerState();

  const handleStartWorkflow = () => {
    if (existingWorkflow) {
      navigate('/bot-launch', { 
        state: { 
          openCreateTask: true,
          selectedWorkflow: existingWorkflow
        } 
      });
    } else {
      toast.error("Please save the workflow first");
    }
  };

  return (
    <WorkflowStateProvider>
      {(flowState) => {
        const { handleDragOver, handleDrop } = useDragAndDrop(flowState.nodes, flowState.setNodes);

        const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (!file) return;

          try {
            const text = await file.text();
            
            if (file.name.endsWith('.json')) {
              console.log('Importing JSON workflow:', text);
              const workflowJson = JSON.parse(text);
              
              const { nodes: importedNodes, edges: importedEdges } = processWorkflowJson(workflowJson);
              
              const puppeteerScript = generatePuppeteerScript(workflowJson);
              console.log('Generated Puppeteer script:', puppeteerScript);
              
              const updatedNodes = [...flowState.nodes, ...importedNodes];
              const updatedEdges = [...flowState.edges, ...importedEdges];
              
              flowState.setNodes(updatedNodes);
              flowState.setEdges(updatedEdges);
              
              toast.success('JSON workflow imported successfully');
            } else {
              console.log('Importing Puppeteer script:', text);
              
              const importedNodes = convertPuppeteerToNodes(text);
              const updatedNodes = [...flowState.nodes, ...importedNodes];
              flowState.setNodes(updatedNodes);
              
              toast.success('Puppeteer script imported successfully');
            }
            
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          } catch (error) {
            console.error('Error importing file:', error);
            toast.error('Failed to import file');
          }
        };

        const handleImportClick = () => {
          fileInputRef.current?.click();
        };

        const handleStartConfirm = async () => {
          console.log("=== Starting workflow execution ===");
          console.log("Selected browser state:", selectedBrowser);
          console.log("Selected server state:", selectedServer);
          console.log("Server token state:", serverToken);
          console.log("Workflow nodes:", flowState.nodes);
          console.log("Workflow edges:", flowState.edges);
          try {
            if (!selectedBrowser) {
              console.error("No browser selected at execution time");
              throw new Error("No browser selected");
            }
            let executionParams;
            if (typeof selectedBrowser === 'object' && selectedBrowser !== null) {
              console.log("Using LinkenSphere session:", selectedBrowser);
              if (!selectedBrowser.debug_port) {
                throw new Error('LinkenSphere session has no debug port');
              }
              executionParams = {
                browserType: 'linkenSphere' as const,
                browserPort: selectedBrowser.debug_port,
                sessionId: selectedBrowser.id
              };
            } else {
              console.log("Using Chrome browser port:", selectedBrowser);
              executionParams = {
                browserType: 'chrome' as const,
                browserPort: selectedBrowser
              };
            }
            console.log("Final execution params:", executionParams);
            if (isRecording) {
              await startRecording(executionParams.browserPort);
              setIsRecording(true);
              toast.success("Recording started");
            } else {
              await startWorkflow(flowState.nodes, flowState.edges, executionParams);
              toast.success("Workflow started successfully");
            }
            setShowStartDialog(false);
          } catch (error) {
            console.error("Error in workflow execution:", error);
            toast.error(error instanceof Error ? error.message : "An error occurred");
          }
        };

        const handleSave = () => {
          if (existingWorkflow) {
            flowState.saveWorkflow({
              id: existingWorkflow.id,
              nodes: flowState.nodes,
              edges: flowState.edges,
              workflowName: flowState.workflowName,
              workflowDescription: flowState.workflowDescription,
              tags: flowState.tags,
              category: flowState.category
            });
            toast.success("Workflow saved successfully");
          } else {
            setShowSaveDialog(true);
          }
        };
        const handleRecordClick = async () => {
          if (isRecording) {
            try {
              const recordedNodes = await stopRecording();
              console.log("Recorded nodes:", recordedNodes);
              setIsRecording(false);
              toast.success("Recording stopped successfully");
            } catch (error) {
              console.error("Error stopping recording:", error);
              toast.error("Failed to stop recording");
            }
          } else {
            setIsRecording(true);
            setShowStartDialog(true);
          }
        };

        const handleSendMessage = (e: React.FormEvent) => {
          e.preventDefault();
          if (!currentMessage.trim()) return;
          setChatMessages(prev => [...prev, {
            role: 'user',
            content: currentMessage
          }]);
          setCurrentMessage('');
      
          // Simulate AI response
          setTimeout(() => {
            setChatMessages(prev => [...prev, {
              role: 'assistant',
              content: "I see you're working on a workflow. Would you like me to help you optimize it?"
            }]);
          }, 1000);
        };

        const addAgentAsNode = (agent: Agent) => {
          const position = { x: 150, y: 150 };
          
          // Create a new node for the AI agent
          const newNode: FlowNodeWithData = {
            id: crypto.randomUUID(),
            type: 'ai-agent',
            position,
            data: { 
              type: 'ai-agent',
              label: agent.name,
              settings: { 
                agentId: agent.id,
                description: agent.description || '',
                taskDescription: agent.task_description || ''
              },
              description: `AI Agent: ${agent.name}`
            },
            style: {
              background: '#fff',
              padding: '15px',
              borderRadius: '8px',
              width: 180,
            },
          };

          // Add the new node to the workflow
          flowState.setNodes([...flowState.nodes, newNode]);
          
          // Close the dialog
          setShowAIAgentsDialog(false);
        };

        return (
          <>
            <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
              {existingWorkflow && (
                <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-zinc-200 shadow-sm">
                  <span className="text-sm font-medium text-zinc-700">
                    {existingWorkflow.name}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 animate-fade-in">
                <Button onClick={() => setShowAIAgentsDialog(true)} className="flex items-center gap-2 bg-gradient-to-br from-[#F97316] to-[#FEC6A1] hover:from-[#F97316] hover:to-[#F97316] text-white shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 group">
                  <Bot className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                    Add AI Agents
                  </span>
                </Button>

                <Button onClick={handleStartWorkflow} className="flex items-center gap-2 bg-gradient-to-br from-[#9b87f5] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 animate-fade-in group">
                  <PlayIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                    Start Workflow
                  </span>
                </Button>
              </div>

              <div className="flex items-center gap-3 animate-fade-in">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".js,.ts,.json"
                  className="hidden"
                />
                <Button 
                  variant="secondary" 
                  size="icon"
                  onClick={() => flowState.setShowVersions(true)}
                  className="hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg"
                >
                  <ClockIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
                </Button>

                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={handleImportClick}
                  className="hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg"
                >
                  <FileUpIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
                </Button>

                <Button variant="secondary" size="icon" onClick={handleSave} className="hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg">
                  <SaveIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
                </Button>

                <Button variant="secondary" size="icon" onClick={() => setIsRecording(!isRecording)} className={`hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg ${isRecording ? "text-red-500 animate-pulse" : ""}`}>
                  <VideoIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
                </Button>

                <Button variant="secondary" size="icon" onClick={() => setShowScript(true)} className="hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg">
                  <EyeIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
                </Button>
              </div>
            </div>

            <FlowLayout
              nodes={flowState.nodes}
              edges={flowState.edges}
              onNodesChange={flowState.onNodesChange}
              onEdgesChange={flowState.onEdgesChange}
              onConnect={flowState.onConnect}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <ScriptDialog open={showScript} onOpenChange={setShowScript} nodes={flowState.nodes} edges={flowState.edges} />
              <WorkflowStartDialog open={showStartDialog} onOpenChange={setShowStartDialog} onConfirm={handleStartConfirm} />
              <SaveWorkflowDialog 
                open={showSaveDialog} 
                onOpenChange={setShowSaveDialog} 
                nodes={flowState.nodes} 
                edges={flowState.edges} 
                onSave={() => {
                  flowState.saveWorkflow({
                    nodes: flowState.nodes,
                    edges: flowState.edges,
                    workflowName: flowState.workflowName,
                    workflowDescription: flowState.workflowDescription,
                    tags: flowState.tags,
                    category: flowState.category
                  });
                  setShowSaveDialog(false);
                }} 
                workflowName={flowState.workflowName}
                setWorkflowName={flowState.setWorkflowName}
                workflowDescription={flowState.workflowDescription}
                setWorkflowDescription={flowState.setWorkflowDescription}
                tags={flowState.tags}
                setTags={flowState.setTags}
                category={flowState.category}
                setCategory={flowState.setCategory}
                categories={flowState.categories}
                editingWorkflow={flowState.existingWorkflow}
              />
              <AIAgentsDialog 
                open={showAIAgentsDialog} 
                onOpenChange={setShowAIAgentsDialog} 
                addAgentAsNode={addAgentAsNode} 
              />
            </FlowLayout>

            <Card className={`
              fixed bottom-4 right-4 w-80
              ${isChatMinimized ? 'h-12' : `h-[${chatHeight}px]`}
              transition-all duration-200
              shadow-lg hover:shadow-xl
              bg-white
              border border-zinc-200
              backdrop-blur-sm
              animate-fade-in
              z-50
              rounded-xl
              overflow-hidden
            `}>
              <div
                ref={resizeRef}
                className={`
                  absolute -top-3 left-0 right-0 h-6 flex items-center justify-center
                  cursor-ns-resize group z-50 hover:bg-zinc-100/50
                  ${isResizing ? 'bg-zinc-100' : ''}
                `}
                onMouseDown={() => setIsResizing(true)}
              >
                <GripHorizontal className="h-4 w-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-2.5 flex justify-between items-center backdrop-blur-md bg-zinc-950 hover:bg-zinc-800">
                <span className="font-medium flex items-center gap-2 text-sm text-white">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AI Flow Assistant
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-70 hover:opacity-100 transition-opacity text-white hover:text-white hover:bg-white/20"
                  onClick={() => setIsChatMinimized(!isChatMinimized)}
                >
                  {isChatMinimized ? <MaximizeIcon className="h-3.5 w-3.5" /> : <MinimizeIcon className="h-3.5 w-3.5" />}
                </Button>
              </div>
              
              <div className={`
                transition-all duration-300
                ${isChatMinimized ? 'opacity-0' : 'opacity-100'}
              `}>
                {!isChatMinimized && (
                  <>
                    <ScrollArea className="flex-1 p-3" style={{ height: chatHeight - 116 }}>
                      <div className="space-y-3">
                        {chatMessages.map((message, index) => (
                          <div
                            key={index}
                            className={`
                              flex 
                              ${message.role === 'user' ? 'justify-end' : 'justify-start'}
                              animate-fade-in
                            `}
                          >
                            <div
                              className={`
                                max-w-[80%] rounded-2xl p-2.5 text-sm
                                transform transition-all duration-200
                                hover:scale-[1.02]
                                ${message.role === 'user' 
                                  ? 'bg-zinc-900 text-white ml-auto rounded-br-sm'
                                  : 'bg-gradient-to-br from-[#F97316] to-[#FEC6A1] text-white rounded-bl-sm'
                                }
                                shadow-sm hover:shadow-md
                              `}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-200 py-[6px] bg-zinc-50">
                      <div className="flex gap-2">
                        <Input
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          placeholder="Ask me about your workflow..."
                          className="flex-1 bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-300 text-sm h-9 my-0 py-0"
                        />
                        <Button 
                          type="submit" 
                          size="icon"
                          className="bg-zinc-900 hover:bg-zinc-800 text-white transition-colors duration-200 hover:scale-105 active:scale-95 h-9 w-9"
                        >
                          <SendIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </Card>
          </>
        );
      }}
    </WorkflowStateProvider>
  );
};

const Canvas = () => {
  return (
    <div className="w-full h-screen bg-background">
      <ReactFlowProvider>
        <CanvasContent />
      </ReactFlowProvider>
    </div>
  );
};

export default Canvas;
