import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { FullPageLoader } from "../ui/Loader";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
