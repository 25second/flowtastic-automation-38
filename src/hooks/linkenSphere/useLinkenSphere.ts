
import { useLinkenSphereState } from './useLinkenSphereState';
import { useSessionActions } from './useSessionActions';
import { useSessionsFetching } from './useSessionsFetching';
import { useSessionsSelection } from './useSessionsSelection';

export const useLinkenSphere = () => {
  const {
    sessions,
    loading,
    loadingSessions,
    selectedSessions,
    searchQuery,
    setSessions,
    setLoading,
    setLoadingSessions,
    setSelectedSessions,
    setSearchQuery,
  } = useLinkenSphereState();

  const { startSession, stopSession } = useSessionActions({
    sessions,
    setSessions,
    setLoadingSessions,
  });

  const { fetchSessions } = useSessionsFetching({
    setSessions,
    setLoading,
  });

  const { toggleSession } = useSessionsSelection({
    setSelectedSessions,
  });

  const startSelectedSessions = async () => {
    for (const sessionId of selectedSessions) {
      await startSession(sessionId);
    }
  };

  const stopSelectedSessions = async () => {
    for (const sessionId of selectedSessions) {
      await stopSession(sessionId);
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    sessions: filteredSessions,
    loading,
    loadingSessions,
    selectedSessions,
    toggleSession,
    searchQuery,
    setSearchQuery,
    fetchSessions,
    startSession,
    stopSession,
    startSelectedSessions,
    stopSelectedSessions,
    setSelectedSessions  // Добавляем экспорт функции
  };
};
