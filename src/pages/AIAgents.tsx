
import { AIAgentsContent } from "@/components/ai-agents/AIAgentsContent";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAccentColor } from '@/hooks/useAccentColor';
import { Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// Custom ErrorBoundary component since React.ErrorBoundary doesn't exist
interface ErrorBoundaryProps {
  children: ReactNode;
  FallbackComponent: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      const { FallbackComponent, onReset } = this.props;
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetErrorBoundary={() => {
            this.setState({ hasError: false, error: null });
            onReset();
          }} 
        />
      );
    }
    return this.props.children;
  }
}

// ErrorFallback component to display when an error occurs
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="p-6 w-full">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{error.message}</p>
        <Button variant="outline" onClick={resetErrorBoundary}>
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  </div>
);

// LoadingFallback component to display while content is loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="animate-pulse flex flex-col gap-4 w-full max-w-3xl p-6">
      <div className="h-8 bg-muted rounded w-1/3"></div>
      <div className="h-24 bg-muted rounded w-full"></div>
      <div className="h-64 bg-muted rounded w-full"></div>
    </div>
  </div>
);

export default function AIAgents() {
  // Apply accent color
  useAccentColor();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <main className="flex-1 w-full h-full overflow-y-auto">
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => window.location.reload()}
          >
            <Suspense fallback={<LoadingFallback />}>
              <AIAgentsContent />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </SidebarProvider>
  );
}
