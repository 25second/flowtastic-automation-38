
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Check, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocalBrowserProfiles } from '@/hooks/useLocalBrowserProfiles';

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
  const { updateActiveDesktop } = useLocalBrowserProfiles();

  const fetchDesktops = async () => {
    if (!show || !port) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:${port}/desktops`);
      if (!response.ok) {
        throw new Error('Failed to fetch desktops');
      }
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const activeDesktopUuid = data.find(desktop => desktop.active === true)?.uuid || null;
        setActiveDesktop(activeDesktopUuid);
        setDesktops(data);
        
        // If we have an active desktop, trigger profile loading for it
        if (activeDesktopUuid) {
          updateActiveDesktop(activeDesktopUuid);
        }
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
      // Update the active desktop in the browser profiles hook
      updateActiveDesktop(uuid);
      toast.success('Desktop switched successfully');
    } catch (error) {
      console.error('Error switching desktop:', error);
      toast.error('Failed to switch desktop');
    } finally {
      setSwitching(null);
    }
  };

  useEffect(() => {
    if (show) {
      fetchDesktops();
    }
  }, [show, port]);

  if (!show) return null;

  const activeDesktopName = activeDesktop 
    ? desktops.find(d => d.uuid === activeDesktop)?.name || `Desktop ${activeDesktop.substring(0, 8)}`
    : 'Select desktop';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">LinkenSphere Desktop</h3>
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
        <div className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  {activeDesktop && <Check className="h-4 w-4 mr-2" />}
                  {activeDesktopName}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-[var(--trigger-width)]" 
              style={{ '--trigger-width': '100%' } as React.CSSProperties}
            >
              <ScrollArea className="max-h-[200px]">
                {desktops.map((desktop) => (
                  <DropdownMenuItem
                    key={desktop.uuid}
                    onClick={() => !switching && switchDesktop(desktop.uuid)}
                    disabled={switching === desktop.uuid}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center w-full">
                      {switching === desktop.uuid ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : desktop.uuid === activeDesktop ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <div className="w-4 mr-2"></div>
                      )}
                      <span>{desktop.name || `Desktop ${desktop.uuid.substring(0, 8)}`}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No desktops available</p>
      )}
    </div>
  );
}
