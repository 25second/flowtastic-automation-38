
import { toast } from "sonner";
import { BrowserSession } from "@/types/task";

interface BrowserSessionResponse {
  id: string;
  name: string;
  status: string;
}

export async function fetchLinkenSphereSessions(port: string = '40080'): Promise<BrowserSession[]> {
  try {
    console.log(`Fetching LinkenSphere sessions from port ${port}...`);
    
    // Use the server proxy endpoint we'll create in the server file
    const response = await fetch(`http://localhost:3001/linken-sphere/sessions?port=${port}`);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error fetching LinkenSphere sessions:', error);
      throw new Error(error.message || 'Failed to fetch LinkenSphere sessions');
    }
    
    const data = await response.json();
    console.log('LinkenSphere sessions data:', data);
    
    // Transform the data into a standard format
    return data.map((session: any) => ({
      id: session.uuid,
      name: session.name,
      status: session.status,
      type: 'session'
    }));
  } catch (error: any) {
    console.error('Error in fetchLinkenSphereSessions:', error);
    toast.error(error.message || 'Failed to fetch LinkenSphere sessions');
    return [];
  }
}

export async function fetchDolphinSessions(): Promise<BrowserSession[]> {
  // This is a placeholder for the actual implementation
  // In a real-world scenario, we would make an API call to the Dolphin browser
  return [
    { id: 'dolphin1', name: 'Dolphin Profile 1', status: 'running', type: 'session' },
    { id: 'dolphin2', name: 'Dolphin Profile 2', status: 'stopped', type: 'session' }
  ];
}

export async function fetchOctoBrowserSessions(): Promise<BrowserSession[]> {
  // This is a placeholder for the actual implementation
  // In a real-world scenario, we would make an API call to the Octo browser
  return [
    { id: 'octo1', name: 'Octo Browser Profile 1', status: 'running', type: 'session' },
    { id: 'octo2', name: 'Octo Browser Profile 2', status: 'stopped', type: 'session' }
  ];
}

export async function fetchMoreloginSessions(): Promise<BrowserSession[]> {
  // This is a placeholder for the actual implementation
  // In a real-world scenario, we would make an API call to the Morelogin browser
  return [
    { id: 'morelogin1', name: 'Morelogin Profile 1', status: 'running', type: 'session' },
    { id: 'morelogin2', name: 'Morelogin Profile 2', status: 'stopped', type: 'session' }
  ];
}

export async function fetchBrowserSessions(browserType: string): Promise<BrowserSession[]> {
  console.log(`Fetching browser sessions for type: ${browserType}`);
  switch (browserType) {
    case 'linkenSphere':
      return fetchLinkenSphereSessions();
    case 'dolphin':
      return fetchDolphinSessions();
    case 'octo':
      return fetchOctoBrowserSessions();
    case 'morelogin':
      return fetchMoreloginSessions();
    default:
      console.error(`Unknown browser type: ${browserType}`);
      return [];
  }
}

export async function startBrowserSession(session: BrowserSession, port: string = '40080'): Promise<{ success: boolean; message: string; debug_port?: number }> {
  console.log(`Attempting to start browser session: ${session.id} on port ${port}`);
  try {
    // For demonstration purposes, we'll simulate a successful start
    // In a real implementation, this would make an API call to the browser
    const debugPort = 9222 + Math.floor(Math.random() * 1000);
    
    // Store the session port for future reference
    localStorage.setItem(`session_${session.id}_port`, debugPort.toString());
    
    console.log(`Successfully started session with debug port: ${debugPort}`);
    return { 
      success: true, 
      message: 'Session started successfully', 
      debug_port: debugPort 
    };
  } catch (error: any) {
    console.error('Error starting browser session:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to start browser session' 
    };
  }
}

export async function checkPortAvailability(port: number): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:3001/ports/check?port=${port}`);
    const data = await response.json();
    return data.available;
  } catch (error) {
    console.error('Error checking port availability:', error);
    return false;
  }
}
