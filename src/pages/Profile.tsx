
import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Profile() {
  const { session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        if (session?.user?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile.");
          } else {
            setProfile(data);
            setUpdatedUsername(data?.username || "");
            setAvatarUrl(data?.avatar_url || null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user?.id]);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: updatedUsername, avatar_url: avatarUrl })
        .eq('id', session?.user?.id);

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile.");
      } else {
        setProfile({ ...profile, username: updatedUsername, avatar_url: avatarUrl });
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1">
          <div className="container max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>

            {isLoading ? (
              <p>Loading profile...</p>
            ) : (
              <>
                <div className="flex items-center space-x-6 mb-6">
                  <Avatar className="w-24 h-24">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Avatar" />
                    ) : (
                      <AvatarFallback>{profile?.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                    )}
                  </Avatar>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" value={session?.user?.email || ''} readOnly disabled />
                  </div>

                  <div>
                    <Label htmlFor="username">Username</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        id="username"
                        value={updatedUsername}
                        onChange={(e) => setUpdatedUsername(e.target.value)}
                      />
                    ) : (
                      <Input type="text" id="username" value={profile?.username || ''} readOnly disabled />
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => {
                          setIsEditing(false);
                          setUpdatedUsername(profile?.username || "");
                          setAvatarUrl(profile?.avatar_url || null);
                        }}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateProfile} disabled={isLoading}>
                          Update Profile
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
