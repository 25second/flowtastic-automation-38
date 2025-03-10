
import React from "react";

export function ApiHeader() {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <h1 className="text-2xl font-bold">API Settings</h1>
      <p className="text-muted-foreground">
        Manage your API keys and endpoints for integration with external services.
      </p>
    </div>
  );
}
