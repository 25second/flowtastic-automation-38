
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIProvidersErrorProps {
  error: Error | string | null;
  role: string | null;
  isOffline: boolean;
}

export function AIProvidersError({ error, role, isOffline }: AIProvidersErrorProps) {
  const handleRefresh = () => window.location.reload();

  // Show network error if offline
  if (isOffline) {
    return (
      <div className="flex-1 p-8 overflow-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">AI Providers</h1>
          <Badge variant="outline" className="px-3 py-1">
            Role: {role || 'Loading...'}
          </Badge>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Network Error</AlertTitle>
          <AlertDescription>
            You appear to be offline. Please check your internet connection and try again.
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
              >
                Refresh Page
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show general error
  if (error) {
    return (
      <div className="flex-1 p-8 overflow-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">AI Providers</h1>
          <Badge variant="outline" className="px-3 py-1">
            Role: {role || 'Loading...'}
          </Badge>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the AI providers: {error instanceof Error ? error.message : String(error)}
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
              >
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
}
