
import { BotLaunchContent } from "@/components/bot-launch/BotLaunchContent";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function BotLaunch() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-background">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <main className="flex-1 h-full overflow-y-auto">
          <BotLaunchContent />
        </main>
      </div>
    </SidebarProvider>
  );
}
