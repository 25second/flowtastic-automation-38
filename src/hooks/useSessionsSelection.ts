
interface UseSessionsSelectionProps {
  setSelectedSessions: (callback: (prev: Set<string>) => Set<string>) => void;
}

export const useSessionsSelection = ({
  setSelectedSessions,
}: UseSessionsSelectionProps) => {
  // This method ensures only one session can be selected at a time
  const selectSingleSession = (sessionId: string) => {
    setSelectedSessions(() => new Set([sessionId]));
  };

  return { selectSingleSession };
};
