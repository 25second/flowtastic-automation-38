
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Workflow Dashboard</h1>
      <SidebarTrigger />
    </div>
  );
}
