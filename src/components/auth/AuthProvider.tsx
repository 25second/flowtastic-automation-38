
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const trackSession = async (currentSession: Session) => {
    try {
      const userAgent = navigator.userAgent;
      const { error } = await supabase
        .from('active_sessions')
        .insert([
          {
            user_id: currentSession.user.id,
            user_agent: userAgent,
            ip_address: 'Client IP'
          }
        ]);
      
      if (error) {
        console.error("Error tracking session:", error);
        return;
      }
    } catch (error) {
      console.error("Failed to track session:", error);
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Initializing");
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("Initial session:", session);
      if (error) {
        console.error("Error getting session:", error);
        toast.error("Authentication error. Please try logging in again.");
        setLoading(false);
        navigate('/auth');
        return;
      }

      setSession(session);
      if (session) {
        trackSession(session);
      }
      
      // Only handle navigation after setting loading to false
      setLoading(false);

      // Now handle navigation
      if (session && location.pathname === '/auth') {
        navigate('/');
      } else if (!session && location.pathname !== '/auth') {
        navigate('/auth');
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session);
      
      if (_event === 'SIGNED_OUT') {
        // Clear any application data
        setSession(null);
        navigate('/auth');
        return;
      }

      if (_event === 'SIGNED_IN' && session) {
        console.log('User signed in successfully');
        await trackSession(session);
      }

      if (_event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }

      setSession(session);
      
      // Handle navigation after auth state changes
      if (session && location.pathname === '/auth') {
        navigate('/');
      } else if (!session && location.pathname !== '/auth') {
        navigate('/auth');
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
