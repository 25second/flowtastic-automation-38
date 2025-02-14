
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
}
