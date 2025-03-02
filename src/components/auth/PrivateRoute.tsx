
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function PrivateRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" />;
  }

  return <Outlet />;
}
