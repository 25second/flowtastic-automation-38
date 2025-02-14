
interface UseSessionsSelectionProps {
  setSelectedSessions: (callback: (prev: Set<string>) => Set<string>) => void;
}

export const useSessionsSelection = ({
  setSelectedSessions,
}: UseSessionsSelectionProps) => {
  const toggleSession = (sessionId: string) => {
    setSelectedSessions(prev => {
      const newSelected = new Set(prev);
      // Если сессия уже выбрана - убираем её
      if (newSelected.has(sessionId)) {
        newSelected.delete(sessionId);
      } else {
        // Если сессия не выбрана - очищаем предыдущие выборы и добавляем только эту
        newSelected.clear();
        newSelected.add(sessionId);
      }
      return newSelected;
    });
  };

  return { toggleSession };
};
