
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

  const updateActiveSession = async (userId: string) => {
    if (!userId) return;
    
    try {
      const userAgent = navigator.userAgent;
      
      const { data: existingSessions, error: checkError } = await supabase
        .from('active_sessions')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
        
      if (checkError) {
        console.error("Error checking existing session:", checkError);
        return;
      }
      
      if (existingSessions && existingSessions.length > 0) {
        const { error: updateError } = await supabase
          .from('active_sessions')
          .update({ 
            last_active: new Date().toISOString(),
            user_agent: userAgent
          })
          .eq('id', existingSessions[0].id);
          
        if (updateError) {
          console.error("Error updating session:", updateError);
        }
      } else {
        const { error: insertError } = await supabase
          .from('active_sessions')
          .insert({
            user_id: userId,
            user_agent: userAgent,
            last_active: new Date().toISOString()
          });
          
        if (insertError) {
          console.error("Error creating session:", insertError);
        }
      }
    } catch (e) {
      console.error("Error tracking session:", e);
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Initializing");
    let authSubscription: { unsubscribe: () => void } | null = null;
    let heartbeatInterval: number | null = null;
    
    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          toast.error("Ошибка аутентификации. Пожалуйста, войдите снова.");
          setLoading(false);
          navigate('/auth');
          return;
        }

        console.log("Initial session:", data.session);
        setSession(data.session);
        
        if (data.session?.user?.id) {
          console.log("User authenticated:", data.session.user.id);
          await updateActiveSession(data.session.user.id);
          
          // Update active session every 5 minutes
          heartbeatInterval = window.setInterval(() => {
            if (data.session?.user?.id) {
              updateActiveSession(data.session.user.id);
            }
          }, 5 * 60 * 1000);
        }
        
        // Handle redirects based on auth status
        if (data.session && location.pathname === '/auth') {
          navigate('/');
        }
        else if (!data.session && location.pathname !== '/auth') {
          navigate('/auth');
        }
        
        setLoading(false);
        
        // Setup auth state change subscription
        authSubscription = supabase.auth.onAuthStateChange((_event, newSession) => {
          console.log("Auth state changed:", _event, newSession);
          
          if (_event === 'SIGNED_OUT') {
            setSession(null);
            navigate('/auth');
            return;
          }

          if (_event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed successfully');
          }

          if (_event === 'SIGNED_IN') {
            console.log('User signed in successfully');
            if (newSession?.user?.id) {
              updateActiveSession(newSession.user.id);
            }
          }

          setSession(newSession);
          
          if (newSession && location.pathname === '/auth') {
            navigate('/');
          } else if (!newSession && location.pathname !== '/auth') {
            navigate('/auth');
          }
        });
      } catch (error) {
        console.error("Critical auth error:", error);
        toast.error("Произошла критическая ошибка аутентификации");
        setLoading(false);
      }
    };

    initAuth();

    // Cleanup function
    return () => {
      console.log("Cleaning up auth subscription");
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, [navigate, location.pathname]);

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
