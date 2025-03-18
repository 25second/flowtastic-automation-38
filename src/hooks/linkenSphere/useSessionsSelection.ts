
interface UseSessionsSelectionProps {
  setSelectedSessions: (callback: (prev: Set<string>) => Set<string>) => void;
}

export const useSessionsSelection = ({
  setSelectedSessions,
}: UseSessionsSelectionProps) => {
  // This method ensures only one session can be selected at a time
  const toggleSession = (sessionId: string) => {
    setSelectedSessions(() => {
      // Always return a new Set with just this session ID
      return new Set<string>([sessionId]);
    });
  };

  // This method always selects just the specified session
  const selectSingleSession = (sessionId: string) => {
    setSelectedSessions(() => new Set([sessionId]));
  };

  return { toggleSession, selectSingleSession };
};
