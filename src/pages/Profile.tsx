
import { useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileContent } from "@/components/profile/ProfileContent";

export default function Profile() {
  const { session } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1">
          <div className="container mx-auto py-8 space-y-6">
            <ProfileHeader userEmail={session?.user?.email} />
            <ProfileContent userEmail={session?.user?.email} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
