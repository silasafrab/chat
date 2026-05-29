import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/contexts/auth-context";
import { LoadingState } from "@/components/composites/loading-state";

export const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  if (user) {
    return <Navigate to="/dashboard/connections" replace />;
  }

  return <Outlet />;
};