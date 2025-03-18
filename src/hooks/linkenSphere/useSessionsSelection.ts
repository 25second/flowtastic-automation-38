interface UseSessionsSelectionProps {
  setSelectedSessions: (callback: (prev: Set<string>) => Set<string>) => void;
}

export const useSessionsSelection = ({
  setSelectedSessions,
}: UseSessionsSelectionProps) => {
  // This method should behave like a radio button - either select just this session,
  // or if it's already selected, deselect it
  const toggleSession = (sessionId: string) => {
    setSelectedSessions(prev => {
      // If this session is already selected, deselect it (return empty set)
      if (prev.has(sessionId)) {
        return new Set<string>();
      }
      
      // Otherwise, select only this session (return new set with just this session)
      return new Set<string>([sessionId]);
    });
  };

  // This method always selects just the specified session
  const selectSingleSession = (sessionId: string) => {
    setSelectedSessions(() => new Set([sessionId]));
  };

  return { toggleSession, selectSingleSession };
};
