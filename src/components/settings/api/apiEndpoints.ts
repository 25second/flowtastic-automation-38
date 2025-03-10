
import { baseServerUrl } from "@/utils/constants";

export interface ApiEndpoint {
  name: string;
  description: string;
  endpoint: string;
  method: string;
}

// Data management endpoints
export const dataManagementEndpoints: ApiEndpoint[] = [
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
  }
];

// Workflow endpoints
export const workflowEndpoints: ApiEndpoint[] = [
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
  }
];

// Tasks endpoints
export const tasksEndpoints: ApiEndpoint[] = [
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
  }
];

// Table management endpoints
export const tableManagementEndpoints: ApiEndpoint[] = [
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
  }
];

// Browser automation endpoints
export const browserEndpoints: ApiEndpoint[] = [
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
