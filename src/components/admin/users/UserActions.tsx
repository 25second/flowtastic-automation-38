
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

interface UserActionsProps {
  userRole: string | null;
}

export function UserActions({ userRole }: UserActionsProps) {
  const [checkingRole, setCheckingRole] = useState(false);
  const { session } = useAuth();
  
  const checkRole = async () => {
    if (!session?.user) {
      toast.error("You must be logged in to check your role");
      return;
    }
    
    setCheckingRole(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', session.user.id);
        
      if (error) {
        console.error("Role check error:", error);
        toast.error("Failed to check role");
      } else {
        console.log("Role check results:", data);
        toast.success("Role data retrieved. Check console for details.");
      }
    } catch (e) {
      console.error("Role check exception:", e);
      toast.error("Error checking role");
    } finally {
      setCheckingRole(false);
    }
  };
  
  return (
    <div className="flex items-center gap-4">
      <Badge variant="outline" className="px-3 py-1">
        Your Role: {userRole || 'Loading...'}
      </Badge>
      <Button variant="outline" size="sm" onClick={checkRole} disabled={checkingRole}>
        <RefreshCw className={`mr-2 h-4 w-4 ${checkingRole ? 'animate-spin' : ''}`} />
        Check Role
      </Button>
      <Button variant="default">
        <UserPlus className="mr-2 h-4 w-4" />
        Add User
      </Button>
    </div>
  );
}
