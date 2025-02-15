import { SidebarTrigger } from "@/components/ui/sidebar";
export function DashboardHeader() {
  return <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Панель управления</h1>
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>
    </div>;
}