
interface UseSessionsSelectionProps {
  setSelectedSessions: (callback: (prev: Set<string>) => Set<string>) => void;
}

export const useSessionsSelection = ({
  setSelectedSessions,
}: UseSessionsSelectionProps) => {
  // This method should clear any previous selections and select only the current session
  const toggleSession = (sessionId: string) => {
    setSelectedSessions(prev => {
      const newSelected = new Set<string>();
      
      // Only add the session if it wasn't already selected
      if (!prev.has(sessionId)) {
        newSelected.add(sessionId);
      }
      
      return newSelected;
    });
  };

  // This method always selects just the specified session
  const selectSingleSession = (sessionId: string) => {
    setSelectedSessions(() => new Set([sessionId]));
  };

  return { toggleSession, selectSingleSession };
};
