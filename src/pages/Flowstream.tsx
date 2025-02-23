
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FlowstreamWorkspace } from "@/components/flowstream/FlowstreamWorkspace";
import { FlowstreamProvider } from "@/components/flowstream/FlowstreamProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Flowstream() {
  return (
    <div className="flex h-screen flex-col">
      <SidebarProvider>
        <DashboardHeader />
        <FlowstreamProvider>
          <FlowstreamWorkspace />
        </FlowstreamProvider>
      </SidebarProvider>
    </div>
  );
}
