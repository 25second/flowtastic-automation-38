
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';

interface SessionSelectorProps {
  selectedBrowser: string | null;
  selectedSession: string | null;
  onBrowserChange: (value: string) => void;
  onSessionChange: (sessionId: string) => void;
}

export function SessionSelector({
  selectedBrowser,
  selectedSession,
  onBrowserChange,
  onSessionChange
}: SessionSelectorProps) {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  
  const fetchSessions = async (browserType: string) => {
    setLoadingSessions(true);
    setSessions([]);
    
    try {
      let sessionsData: any[] = [];
      
      if (browserType === 'linkenSphere') {
        try {
          const response = await fetch('http://localhost:3001/linken-sphere/sessions?port=40080');
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          
          const data = await response.json();
          
          sessionsData = data.map((session: any) => ({
            id: session.uuid,
            name: session.name,
            status: session.status
          }));
        } catch (error) {
          console.error('Error fetching LinkenSphere sessions:', error);
          toast.error('Failed to fetch browser sessions');
          sessionsData = [];
        }
      } else if (browserType === 'dolphin') {
        sessionsData = [
          { id: 'dolphin1', name: 'Dolphin Profile 1', status: 'running' },
          { id: 'dolphin2', name: 'Dolphin Profile 2', status: 'stopped' }
        ];
      } else if (browserType === 'octo') {
        sessionsData = [
          { id: 'octo1', name: 'Octo Profile 1', status: 'running' },
          { id: 'octo2', name: 'Octo Profile 2', status: 'stopped' }
        ];
      } else if (browserType === 'morelogin') {
        sessionsData = [
          { id: 'more1', name: 'Morelogin Profile 1', status: 'running' },
          { id: 'more2', name: 'Morelogin Profile 2', status: 'stopped' }
        ];
      }
      
      setSessions(sessionsData);
    } catch (error) {
      console.error(`Error fetching sessions:`, error);
      toast.error('Failed to fetch browser sessions');
    } finally {
      setLoadingSessions(false);
    }
  };
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="browser-select">{t('agents.select_browser') || 'Select browser'}</Label>
        <Select 
          onValueChange={(value) => {
            onBrowserChange(value);
            fetchSessions(value);
          }}
          value={selectedBrowser || ''}
        >
          <SelectTrigger id="browser-select">
            <SelectValue placeholder={t('agents.select_browser_placeholder') || 'Select a browser'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linkenSphere">Linken Sphere</SelectItem>
            <SelectItem value="dolphin">Dolphin (Anty)</SelectItem>
            <SelectItem value="octo">Octo Browser</SelectItem>
            <SelectItem value="morelogin">Morelogin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {selectedBrowser && (
        <div className="space-y-2">
          <Label>{t('agents.select_session') || 'Select session'}</Label>
          {loadingSessions ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {t('agents.no_sessions_found') || 'No sessions found'}
            </div>
          ) : (
            <ScrollArea className="h-60 border rounded-md p-2">
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div 
                    key={session.id}
                    className={`p-3 border rounded-md flex items-center gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                      selectedSession === session.id ? 'border-primary bg-accent/50' : ''
                    }`}
                    onClick={() => onSessionChange(session.id)}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      session.status === 'running' || session.status === 'automationRunning' 
                        ? 'bg-green-500' 
                        : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="font-medium">{session.name}</p>
                      <p className="text-xs text-muted-foreground">Status: {session.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}
    </>
  );
}
