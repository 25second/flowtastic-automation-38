
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { EmailSection } from "@/components/profile/EmailSection";
import { PasswordSection } from "@/components/profile/PasswordSection";
import { MagicLinkSection } from "@/components/profile/MagicLinkSection";
import { ActiveSessionsSection } from "@/components/profile/ActiveSessionsSection";

export default function Profile() {
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session?.user?.email]);

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <div className="flex-1">
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <DashboardHeader />
            <div className="flex-1 space-y-4">
              <ProfileHeader />
              <div className="container space-y-8 max-w-5xl">
                <EmailSection initialEmail={email} />
                <PasswordSection />
                <MagicLinkSection userEmail={session?.user?.email} />
                <ActiveSessionsSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
