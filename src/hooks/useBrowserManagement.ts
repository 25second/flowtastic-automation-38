
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Browser } from '@/types/server';

export const useBrowserManagement = (serverUrl: string | null) => {
  const [browsers, setBrowsers] = useState<Browser[]>([]);
  const [selectedBrowser, setSelectedBrowser] = useState<number | null>(null);

  const fetchBrowsers = async (url: string) => {
    try {
      const response = await fetch(`${url}/browsers`);
      if (!response.ok) throw new Error('Failed to fetch browsers');
      const { browsers: availableBrowsers } = await response.json();
      setBrowsers(availableBrowsers);
      if (availableBrowsers.length > 0) {
        setSelectedBrowser(availableBrowsers[0].port);
      }
    } catch (error) {
      console.error('Error fetching browsers:', error);
      toast.error('Failed to fetch available browsers');
    }
  };

  useEffect(() => {
    if (serverUrl) {
      fetchBrowsers(serverUrl);
    } else {
      setBrowsers([]);
      setSelectedBrowser(null);
    }
  }, [serverUrl]);

  return {
    browsers,
    selectedBrowser,
    setSelectedBrowser,
  };
};
