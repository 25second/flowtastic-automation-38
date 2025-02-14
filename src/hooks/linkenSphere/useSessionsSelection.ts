
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
        // Важное изменение: НЕ очищаем предыдущие выборы
        newSelected.add(sessionId);
      }
      return newSelected;
    });
  };

  return { toggleSession };
};
