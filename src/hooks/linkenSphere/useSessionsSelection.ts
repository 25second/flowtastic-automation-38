
interface UseSessionsSelectionProps {
  setSelectedSessions: (callback: (prev: Set<string>) => Set<string>) => void;
}

export const useSessionsSelection = ({
  setSelectedSessions,
}: UseSessionsSelectionProps) => {
  const toggleSession = (sessionId: string) => {
    setSelectedSessions(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(sessionId)) {
        newSelected.delete(sessionId);
      } else {
        // Очищаем старый выбор и выбираем только текущую сессию
        newSelected.clear();
        newSelected.add(sessionId);
      }
      return newSelected;
    });
  };

  const selectSingleSession = (sessionId: string) => {
    setSelectedSessions(() => new Set([sessionId]));
  };

  return { toggleSession, selectSingleSession };
};
