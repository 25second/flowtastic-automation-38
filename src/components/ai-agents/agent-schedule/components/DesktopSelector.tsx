
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Desktop {
  uuid: string;
  name: string;
  status: string;
  active?: boolean;
}

interface DesktopSelectorProps {
  show: boolean;
  port: string;
}

export function DesktopSelector({ show, port }: DesktopSelectorProps) {
  const [desktops, setDesktops] = useState<Desktop[]>([]);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);
  const [activeDesktop, setActiveDesktop] = useState<string | null>(null);

  const fetchDesktops = async () => {
    if (!show || !port) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:${port}/desktops`);
      if (!response.ok) {
        throw new Error('Failed to fetch desktops');
      }
      const data = await response.json();
      
      // Check if we received an array of desktops
      if (Array.isArray(data)) {
        // Find the active desktop if present
        const activeDesktopUuid = data.find(desktop => desktop.active === true)?.uuid || null;
        setActiveDesktop(activeDesktopUuid);
        setDesktops(data);
      } else {
        setDesktops([]);
      }
    } catch (error) {
      console.error('Error fetching desktops:', error);
      toast.error('Failed to load desktops');
    } finally {
      setLoading(false);
    }
  };

  const switchDesktop = async (uuid: string) => {
    setSwitching(uuid);
    try {
      const response = await fetch(`http://127.0.0.1:${port}/desktops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to switch desktop');
      }
      
      setActiveDesktop(uuid);
      toast.success('Desktop switched successfully');
    } catch (error) {
      console.error('Error switching desktop:', error);
      toast.error('Failed to switch desktop');
    } finally {
      setSwitching(null);
    }
  };

  useEffect(() => {
    fetchDesktops();
    
    // Refresh desktops every 5 seconds if visible
    if (show) {
      const interval = setInterval(fetchDesktops, 5000);
      return () => clearInterval(interval);
    }
  }, [show, port]);

  if (!show) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Available Desktops</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchDesktops} 
          disabled={loading}
          className="h-8 px-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : desktops.length > 0 ? (
        <ScrollArea className="max-w-full">
          <div className="flex space-x-2 pb-1">
            {desktops.map((desktop) => (
              <Button
                key={desktop.uuid}
                variant={desktop.uuid === activeDesktop ? "default" : "outline"}
                size="sm"
                onClick={() => switchDesktop(desktop.uuid)}
                disabled={switching === desktop.uuid}
                className="whitespace-nowrap"
              >
                {switching === desktop.uuid ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : desktop.uuid === activeDesktop ? (
                  <Check className="h-3 w-3 mr-1" />
                ) : null}
                {desktop.name || `Desktop ${desktop.uuid.substring(0, 8)}`}
              </Button>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <p className="text-sm text-muted-foreground">No desktops available</p>
      )}
    </div>
  );
}
