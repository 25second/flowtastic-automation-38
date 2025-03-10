
import React from "react";
import { ApiHeader } from "./api/ApiHeader";
import { ApiEndpointSection } from "./api/ApiEndpointSection";
import {
  dataManagementEndpoints,
  workflowEndpoints,
  tasksEndpoints,
  tableManagementEndpoints,
  browserEndpoints,
} from "./api/apiEndpoints";

export function ApiSettings() {
  return (
    <div className="space-y-8">
      <ApiHeader />
      
      <ApiEndpointSection title="Data Management" endpoints={dataManagementEndpoints} />
      <ApiEndpointSection title="Workflows" endpoints={workflowEndpoints} />
      <ApiEndpointSection title="Tasks" endpoints={tasksEndpoints} />
      <ApiEndpointSection title="Table Management" endpoints={tableManagementEndpoints} />
      <ApiEndpointSection title="Browser Automation" endpoints={browserEndpoints} />

      <p className="text-sm text-muted-foreground">
        Refer to the documentation for detailed API usage instructions.
      </p>
    </div>
  );
}
