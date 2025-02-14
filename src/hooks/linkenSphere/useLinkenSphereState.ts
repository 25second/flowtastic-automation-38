
import { useState } from 'react';
import { LinkenSphereState } from './types';

export const useLinkenSphereState = () => {
  const [sessions, setSessions] = useState<LinkenSphereState['sessions']>([]);
  const [loading, setLoading] = useState(false);
  // Изменяем тип на Map для хранения id сессий и их состояния загрузки
  const [loadingSessions, setLoadingSessions] = useState<Map<string, boolean>>(new Map());
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  return {
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
  };
};
