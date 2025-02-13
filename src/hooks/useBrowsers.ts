
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API_URL = 'http://localhost:3001';

export const useBrowsers = (selectedServer: string | null, serverToken: string) => {
  const [browsers, setBrowsers] = useState<Array<{port: number, name: string, type: string}>>([]);
  const [selectedBrowser, setSelectedBrowser] = useState<number | null>(null);

  useEffect(() => {
    const fetchBrowsers = async () => {
      if (!selectedServer) {
        setBrowsers([]);
        setSelectedBrowser(null);
        return;
      }

      try {
        console.log('Attempting to fetch browsers from:', `${API_URL}/server/browsers`);
        console.log('Selected server:', selectedServer);
        console.log('Server token:', serverToken);

        const response = await fetch(`${API_URL}/server/browsers`, {
          headers: {
            'Authorization': `Bearer ${serverToken}`,
            'Content-Type': 'application/json'
          },
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch browsers: ${errorText}`);
        }

        const data = await response.json();
        console.log('Successfully fetched browsers data:', data);
        
        if (!data.browsers) {
          console.warn('No browsers array in response');
          setBrowsers([]);
          return;
        }

        setBrowsers(data.browsers);
        
        if (data.browsers.length > 0) {
          console.log('Setting default browser:', data.browsers[0]);
          setSelectedBrowser(data.browsers[0].port);
        }
      } catch (error) {
        console.error('Error fetching browsers:', error);
        toast.error('Failed to fetch browsers');
        setBrowsers([]);
        setSelectedBrowser(null);
      }
    };

    if (selectedServer && serverToken) {
      fetchBrowsers();
    }
  }, [selectedServer, serverToken]);

  return { browsers, selectedBrowser, setSelectedBrowser, setBrowsers };
};
