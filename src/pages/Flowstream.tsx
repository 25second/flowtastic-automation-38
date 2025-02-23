
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FlowstreamWorkspace } from "@/components/flowstream/FlowstreamWorkspace";
import { FlowstreamProvider } from "@/components/flowstream/FlowstreamProvider";

export default function Flowstream() {
  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader />
      <FlowstreamProvider>
        <FlowstreamWorkspace />
      </FlowstreamProvider>
    </div>
  );
}
