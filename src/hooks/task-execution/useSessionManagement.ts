
import { useEffect, useState } from 'react';
import { BrowserSession } from '@/types/task';
import { startBrowserSession as startSession } from '@/utils/agents/browserProxyService';

// Store session port information in localStorage for persistence
export const storeSessionPort = (sessionId: string, port: number) => {
  if (!sessionId || !port) return;
  localStorage.setItem(`session_${sessionId}_port`, port.toString());
  console.log(`Stored port ${port} for session ${sessionId}`);
};

export const getStoredSessionPort = (sessionId: string): number | null => {
  if (!sessionId) return null;
  
  const portValue = localStorage.getItem(`session_${sessionId}_port`);
  
  if (!portValue) {
    console.warn(`No port found for session ${sessionId}`);
    return null;
  }
  
  const port = parseInt(portValue, 10);
  return isNaN(port) ? null : port;
};

// Check if a session has an active status
export const checkSessionStatus = async (sessionId: string, port: string = '40080'): Promise<string> => {
  try {
    console.log(`Checking status for session ${sessionId} on port ${port}`);
    // For now, just check if we have a port stored for this session
    const storedPort = getStoredSessionPort(sessionId);
    return storedPort ? 'running' : 'stopped';
  } catch (error) {
    console.error(`Error checking session status: ${error}`);
    return 'unknown';
  }
};

// Start a browser session
export const startBrowserSession = async (
  session: BrowserSession, 
  port: string = '40080'
): Promise<{ port: number } | null> => {
  try {
    console.log(`Starting browser session ${session.id} on port ${port}`);
    const result = await startSession(session, port);
    
    if (result.success && result.debug_port) {
      console.log(`Session started with debug port: ${result.debug_port}`);
      return { port: result.debug_port };
    }
    
    return null;
  } catch (error) {
    console.error(`Error starting browser session: ${error}`);
    return null;
  }
};

export const useSessionManagement = () => {
  const [sessionPort, setSessionPort] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const setActiveSession = (id: string, port: number) => {
    if (!id || !port) return;
    
    storeSessionPort(id, port);
    setSessionId(id);
    setSessionPort(port);
  };
  
  return {
    sessionPort,
    sessionId,
    setActiveSession,
    getStoredPort: getStoredSessionPort,
    // Export the functions directly so they can be used
    startBrowserSession,
    checkSessionStatus
  };
};
