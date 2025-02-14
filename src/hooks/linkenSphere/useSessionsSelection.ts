
interface UseSessionsSelectionProps {
  setSelectedSessions: (callback: (prev: Set<string>) => Set<string>) => void;
}

export const useSessionsSelection = ({
  setSelectedSessions,
}: UseSessionsSelectionProps) => {
  const toggleSession = (sessionId: string) => {
    setSelectedSessions(prev => {
      const newSelected = new Set<string>();
      if (!prev.has(sessionId)) {
        newSelected.add(sessionId);
      }
      return newSelected;
    });
  };

  return { toggleSession };
};
