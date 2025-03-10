
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { baseServerUrl } from "@/utils/constants";

interface ApiEndpoint {
  name: string;
  description: string;
  endpoint: string;
  method: string;
}

export function ApiSettings() {
  const { session } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [apiToken, setApiToken] = useState<string>("");

  // List of API endpoints
  const apiEndpoints: ApiEndpoint[] = [
    // Data management endpoints
    {
      name: "Tables API",
      description: "Get table data or modify tables",
      endpoint: `${baseServerUrl}/functions/v1/table-api`,
      method: "POST"
    },
    {
      name: "AI Action",
      description: "Execute AI-powered actions",
      endpoint: `${baseServerUrl}/functions/v1/ai-action`,
      method: "POST"
    },
    {
      name: "Generate with AI",
      description: "Generate content using AI",
      endpoint: `${baseServerUrl}/functions/v1/generate-with-ai`,
      method: "POST"
    },
    {
      name: "Tasks API",
      description: "Manage automated tasks",
      endpoint: `${baseServerUrl}/functions/v1/task-api`,
      method: "POST"
    },
    
    // Workflow endpoints
    {
      name: "Workflow List",
      description: "Get list of all workflows",
      endpoint: `${baseServerUrl}/api/workflows`,
      method: "GET"
    },
    {
      name: "Create Workflow",
      description: "Create a new workflow",
      endpoint: `${baseServerUrl}/api/workflows`,
      method: "POST"
    },
    {
      name: "Update Workflow",
      description: "Update an existing workflow",
      endpoint: `${baseServerUrl}/api/workflows/:id`,
      method: "PUT"
    },
    {
      name: "Delete Workflow",
      description: "Delete a workflow",
      endpoint: `${baseServerUrl}/api/workflows/:id`,
      method: "DELETE"
    },
    {
      name: "Run Workflow",
      description: "Execute a workflow",
      endpoint: `${baseServerUrl}/api/workflows/:id/run`,
      method: "POST"
    },
    
    // Tasks endpoints
    {
      name: "Task List",
      description: "Get list of all tasks",
      endpoint: `${baseServerUrl}/api/tasks`,
      method: "GET"
    },
    {
      name: "Create Task",
      description: "Create a new scheduled task",
      endpoint: `${baseServerUrl}/api/tasks`,
      method: "POST"
    },
    {
      name: "Update Task",
      description: "Update an existing task",
      endpoint: `${baseServerUrl}/api/tasks/:id`,
      method: "PUT"
    },
    {
      name: "Delete Task",
      description: "Delete a task",
      endpoint: `${baseServerUrl}/api/tasks/:id`,
      method: "DELETE"
    },
    {
      name: "Task Logs",
      description: "Get logs for a specific task",
      endpoint: `${baseServerUrl}/api/tasks/:id/logs`,
      method: "GET"
    },
    
    // Table management endpoints
    {
      name: "Get Tables",
      description: "Get list of all custom tables",
      endpoint: `${baseServerUrl}/api/tables`,
      method: "GET"
    },
    {
      name: "Create Table",
      description: "Create a new custom table",
      endpoint: `${baseServerUrl}/api/tables`,
      method: "POST"
    },
    {
      name: "Update Table",
      description: "Update table structure",
      endpoint: `${baseServerUrl}/api/tables/:id`,
      method: "PUT"
    },
    {
      name: "Delete Table",
      description: "Delete a custom table",
      endpoint: `${baseServerUrl}/api/tables/:id`,
      method: "DELETE"
    },
    
    // Browser automation endpoints
    {
      name: "Browser Sessions",
      description: "Get active browser sessions",
      endpoint: `${baseServerUrl}/api/browsers/sessions`,
      method: "GET"
    },
    {
      name: "Create Browser Session",
      description: "Start a new browser session",
      endpoint: `${baseServerUrl}/api/browsers/sessions`,
      method: "POST"
    },
    {
      name: "Close Browser Session",
      description: "Close a browser session",
      endpoint: `${baseServerUrl}/api/browsers/sessions/:id`,
      method: "DELETE"
    }
  ];

  useEffect(() => {
    if (session?.access_token) {
      setApiToken(session.access_token);
    }
  }, [session]);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(apiToken);
    toast({
      title: t('app.copied'),
      description: "API token copied to clipboard",
    });
  };

  const handleCopyEndpoint = (endpoint: string) => {
    navigator.clipboard.writeText(endpoint);
    toast({
      title: t('app.copied'),
      description: "API endpoint copied to clipboard",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">API Access</h2>
        <p className="text-muted-foreground mb-4">
          Use this token to authenticate your API requests. Include it in the Authorization header.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-token">API Token</Label>
            <div className="flex">
              <Input
                id="api-token"
                value={apiToken}
                readOnly
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="ml-2"
                onClick={handleCopyToken}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Example: <code>Authorization: Bearer {apiToken.substring(0, 15)}...</code>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Available API Endpoints</h2>
        <div className="space-y-4">
          {apiEndpoints.map((endpoint, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{endpoint.name}</h3>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                      {endpoint.method}
                    </span>
                    <code className="text-xs break-all">{endpoint.endpoint}</code>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleCopyEndpoint(endpoint.endpoint)}
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Refer to the documentation for detailed API usage instructions.
        </p>
      </div>
    </div>
  );
}
