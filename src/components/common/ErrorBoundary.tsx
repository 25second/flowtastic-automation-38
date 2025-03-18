import React, { Component, ErrorInfo, ReactNode } from 'react';
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
    // Update state so the next render will show the fallback UI
    console.error('ErrorBoundary caught an error:', error.message);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error("Error caught by boundary:", error);
    console.error("Component stack:", errorInfo.componentStack);
    
    // Можно добавить отправку ошибки в аналитику или сервис мониторинга
    try {
      // Запись ошибки в localStorage для диагностики
      localStorage.setItem('lastError', JSON.stringify({
        message: error.message,
        stack: error.stack,
        time: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Failed to save error details:', e);
    }
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      const { FallbackComponent = DefaultErrorFallback, onReset = () => window.location.reload() } = this.props;
      
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetErrorBoundary={() => {
            console.log('Resetting error boundary...');
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
      <AlertTitle>Что-то пошло не так</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{error.message}</p>
        <details className="mb-4 text-sm">
          <summary className="cursor-pointer">Технические детали</summary>
          <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto max-h-24 p-2 bg-slate-100 rounded">
            {error.stack}
          </pre>
        </details>
        <Button variant="outline" onClick={resetErrorBoundary}>
          Попробовать снова
        </Button>
      </AlertDescription>
    </Alert>
  </div>
);
