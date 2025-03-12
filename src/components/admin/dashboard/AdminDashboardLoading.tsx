
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboardLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <Skeleton className="h-8 w-[200px] mx-auto" />
        <Skeleton className="h-4 w-[300px] mx-auto" />
        <p className="mt-4 text-sm text-muted-foreground">Loading admin dashboard...</p>
      </div>
    </div>
  );
}
