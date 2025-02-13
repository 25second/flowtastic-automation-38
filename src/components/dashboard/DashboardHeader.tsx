
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <img 
          src="/lovable-uploads/53b11818-7923-4c9b-a3db-be229da03831.png" 
          alt="Ornold Logo" 
          className="h-8 dark:invert"
        />
      </div>
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>
    </div>
  );
}
