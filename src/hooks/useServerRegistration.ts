
import { toast } from 'sonner';

const API_URL = 'http://localhost:3001';

export const useServerRegistration = (
  serverToken: string,
  setShowServerDialog: (show: boolean) => void,
  setBrowsers: (browsers: Array<{port: number, name: string, type: string}>) => void,
  setSelectedBrowser: (port: number | null) => void
) => {
  const registerServer = async () => {
    if (!serverToken) {
      toast.error('Server token is required');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/server/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serverToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Server registration failed: ${errorData.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      setBrowsers(data.browsers || []);
      
      if (data.browsers && data.browsers.length > 0) {
        setSelectedBrowser(data.browsers[0].port);
      }
      
      setShowServerDialog(false);
      toast.success('Server registered successfully');
    } catch (error) {
      console.error('Server registration error:', error);
      toast.error('Failed to register server');
    }
  };

  return { registerServer };
};
