
export interface LinkenSphereSession {
  id: string;
  uuid: string;
  name: string;
  status: string;
  debug_port?: number;
}

export interface LinkenSphereState {
  sessions: LinkenSphereSession[];
  loading: boolean;
  loadingSessions: Set<string>;
  selectedSessions: Set<string>;
  searchQuery: string;
  setSessions: (sessions: LinkenSphereSession[]) => void;
  setLoading: (loading: boolean) => void;
  setLoadingSessions: (callback: (prev: Set<string>) => Set<string>) => void;
  setSelectedSessions: (callback: (prev: Set<string>) => Set<string>) => void;
  setSearchQuery: (query: string) => void;
}
