
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WorkflowRunner } from '@/components/dashboard/WorkflowRunner';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useServerState } from '@/hooks/useServerState';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';

export function Index() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  
  const {
    selectedServer,
    setSelectedServer,
    serverToken,
    setServerToken,
    showServerDialog,
    setShowServerDialog,
    registerServer,
    startWorkflow,
    browsers,
    selectedBrowser,
    setSelectedBrowser,
    startRecording,
    stopRecording,
    servers,
  } = useServerState();

  const { workflowList, handleSaveWorkflow } = useWorkflowManager();

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/dashboard">
              <Button className="w-full">Open Dashboard</Button>
            </Link>
            <Link to="/servers">
              <Button className="w-full" variant="outline">Manage Servers</Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Workflows</h2>
          <div className="space-y-2">
            {workflowList.slice(0, 3).map((workflow) => (
              <Button
                key={workflow.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setSelectedWorkflow(workflow);
                  setShowBrowserDialog(true);
                }}
              >
                {workflow.name}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Server Status</h2>
          <div className="space-y-2">
            {servers.map((server) => (
              <div
                key={server.id}
                className="flex items-center justify-between p-2 bg-secondary rounded"
              >
                <span>{server.name || server.url}</span>
                <span className={`h-2 w-2 rounded-full ${
                  server.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {showBrowserDialog && (
        <WorkflowRunner
          selectedWorkflow={selectedWorkflow}
          setSelectedWorkflow={setSelectedWorkflow}
          showBrowserDialog={showBrowserDialog}
          setShowBrowserDialog={setShowBrowserDialog}
        />
      )}
    </div>
  );
}
