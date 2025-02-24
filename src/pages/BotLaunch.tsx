
import { BotLaunchContent } from "@/components/bot-launch/BotLaunchContent";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAccentColor } from '@/hooks/useAccentColor';

export default function BotLaunch() {
  // Apply accent color
  useAccentColor();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background">
        <DashboardSidebar onNewWorkflow={() => {}} />
        <main className="flex-1 w-full h-full overflow-y-auto">
          <BotLaunchContent />
        </main>
      </div>
    </SidebarProvider>
  );
}
