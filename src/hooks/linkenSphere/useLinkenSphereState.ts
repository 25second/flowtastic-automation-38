
import { useState } from 'react';
import { LinkenSphereState } from './types';

export const useLinkenSphereState = () => {
  const [sessions, setSessions] = useState<LinkenSphereState['sessions']>([]);
  const [loading, setLoading] = useState(false);
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
