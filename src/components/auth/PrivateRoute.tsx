
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";

export function PrivateRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-6">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-32 w-full rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" />;
  }

  return <Outlet />;
}
