
import { toast } from "sonner";
import { BrowserSession } from "@/types/task";

interface BrowserSessionResponse {
  id: string;
  name: string;
  status: string;
}

export async function fetchLinkenSphereSessions(port: string = '40080'): Promise<BrowserSession[]> {
  try {
    // Use the server proxy endpoint we'll create in the server file
    const response = await fetch(`http://localhost:3001/linken-sphere/sessions?port=${port}`);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error fetching LinkenSphere sessions:', error);
      throw new Error(error.message || 'Failed to fetch LinkenSphere sessions');
    }
    
    const data = await response.json();
    
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
