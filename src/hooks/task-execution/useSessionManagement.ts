
import { useEffect, useState } from 'react';

// Store session port information in localStorage for persistence
export const storeSessionPort = (sessionId: string, port: number) => {
  localStorage.setItem(`session_${sessionId}_port`, port.toString());
  console.log(`Stored port ${port} for session ${sessionId}`);
};

export const getStoredSessionPort = (sessionId: string): number | null => {
  const portValue = localStorage.getItem(`session_${sessionId}_port`);
  console.log(`Retrieved port for session ${sessionId}: ${portValue}`);
  
  if (!portValue) {
    console.warn(`No port found for session ${sessionId}`);
    return null;
  }
  
  const port = parseInt(portValue, 10);
  return isNaN(port) ? null : port;
};

export const useSessionManagement = () => {
  const [sessionPort, setSessionPort] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const setActiveSession = (id: string, port: number) => {
    storeSessionPort(id, port);
    setSessionId(id);
    setSessionPort(port);
  };
  
  return {
    sessionPort,
    sessionId,
    setActiveSession,
    getStoredPort: getStoredSessionPort
  };
};
