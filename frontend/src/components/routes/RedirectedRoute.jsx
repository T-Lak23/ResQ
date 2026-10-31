import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { FullPageLoader } from "../ui/Loader";

export default function RedirectedRoute() {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <FullPageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
