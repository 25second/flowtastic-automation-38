
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// ErrorBoundary props
interface ErrorBoundaryProps {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  onReset?: () => void;
}

// ErrorBoundary state
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ErrorBoundary component
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
      const { FallbackComponent = DefaultErrorFallback, onReset = () => window.location.reload() } = this.props;
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

// Default error fallback component
export const DefaultErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
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
