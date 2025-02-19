
import { BotLaunchContent } from "@/components/bot-launch/BotLaunchContent";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function BotLaunch() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar onNewWorkflow={() => {}} />
      <main className="flex-1 overflow-auto">
        <BotLaunchContent />
      </main>
    </div>
  );
}
