
import { useState, useCallback } from 'react';

export function useAgentErrors() {
  const [executionErrors, setExecutionErrors] = useState<Record<string, string>>({});

  const clearError = useCallback((agentId: string) => {
    setExecutionErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[agentId];
      return newErrors;
    });
  }, []);

  const setError = useCallback((agentId: string, errorMessage: string) => {
    setExecutionErrors(prev => ({
      ...prev,
      [agentId]: errorMessage
    }));
  }, []);

  const getAgentError = useCallback((agentId: string) => 
    agentId ? executionErrors[agentId] : undefined,
  [executionErrors]);

  return {
    executionErrors,
    clearError,
    setError,
    getAgentError
  };
}
