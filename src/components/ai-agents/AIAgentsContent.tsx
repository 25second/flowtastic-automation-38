
import { Suspense, useEffect, useState } from "react";
import { AICategoriesAgentsContent } from "./AICategoriesAgentsContent";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingFallback } from "@/components/common/LoadingFallback";

export function AIAgentsContent() {
  const [error, setError] = useState<string | null>(null);
  
  // Main component with error handling wrapper
  try {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AICategoriesAgentsContent />
      </Suspense>
    );
  } catch (err) {
    // Handle errors from hooks to prevent white screen
    useEffect(() => {
      console.error("Error in AIAgentsContent:", err);
      setError(err instanceof Error ? err.message : "Failed to load AI Agents");
    }, [err]);

    // Render a fallback UI when hooks fail
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">AI Agents</h1>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reload
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Failed to load agents</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{error || "There was an error loading the AI Agents. Please try refreshing the page."}</p>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Reload page
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  // Clear local state that might be causing issues
                  localStorage.removeItem('agentState');
                  localStorage.removeItem('agentFilters');
                  window.location.reload();
                }}
              >
                Reset & reload
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
