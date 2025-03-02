
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserRole } from "@/hooks/useUserRole";

export function RoleManagement() {
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const { role, isAdmin } = useUserRole();
  
  const makeAdmin = async () => {
    if (!session?.user) {
      toast.error("You must be logged in");
      return;
    }
    
    setLoading(true);
    try {
      // First check if there is already a role entry
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      console.log("Existing role entry:", existingRole);
      
      let result;
      
      if (existingRole) {
        // Update existing role
        result = await supabase
          .from('user_roles')
          .update({ role: 'admin' })
          .eq('user_id', session.user.id);
      } else {
        // Insert new role
        result = await supabase
          .from('user_roles')
          .insert({ 
            user_id: session.user.id,
            role: 'admin'
          });
      }
      
      if (result.error) {
        console.error("Error setting admin role:", result.error);
        toast.error("Failed to set admin role: " + result.error.message);
      } else {
        console.log("Admin role set successfully");
        toast.success("Admin role granted successfully! Please refresh the page or log out and back in.");
      }
    } catch (error) {
      console.error("Exception setting admin role:", error);
      toast.error("An error occurred while setting admin role");
    } finally {
      setLoading(false);
    }
  };
  
  const checkRoleDirectly = async () => {
    if (!session?.user) {
      toast.error("You must be logged in");
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error("Error checking role:", error);
        toast.error("Failed to check role: " + error.message);
      } else {
        console.log("Direct role check result:", data);
        if (data && data.length > 0) {
          toast.success(`Your role: ${data[0].role}`);
        } else {
          toast.info("No role assigned yet");
        }
      }
    } catch (error) {
      console.error("Exception checking role:", error);
      toast.error("An error occurred while checking role");
    } finally {
      setLoading(false);
    }
  };
  
  const clearRoles = async () => {
    if (!session?.user) {
      toast.error("You must be logged in");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error("Error clearing role:", error);
        toast.error("Failed to clear role: " + error.message);
      } else {
        console.log("Role cleared successfully");
        toast.success("Role cleared successfully! Please refresh the page.");
      }
    } catch (error) {
      console.error("Exception clearing role:", error);
      toast.error("An error occurred while clearing role");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4 p-6 border rounded-lg bg-card mt-4">
      <h3 className="text-lg font-semibold">Role Management</h3>
      <p className="text-sm text-muted-foreground">Current role: {role || 'None'}</p>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="default" 
          onClick={makeAdmin} 
          disabled={loading || isAdmin}
        >
          Make Me Admin
        </Button>
        
        <Button 
          variant="outline" 
          onClick={checkRoleDirectly} 
          disabled={loading}
        >
          Check My Role Directly
        </Button>
        
        <Button 
          variant="destructive" 
          onClick={clearRoles} 
          disabled={loading}
        >
          Clear My Role
        </Button>
      </div>
    </div>
  );
}
