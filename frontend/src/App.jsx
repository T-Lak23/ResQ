import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { useAuthStore } from "./store/authStore";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import RedirectedRoute from "./components/routes/RedirectedRoute";
import RegisterPage from "./pages/RegisterPage";
import TablesPage from "./pages/TablesPage";
import { FullPageLoader } from "./components/ui/Loader";
import BookingPage from "./pages/BookingPage";
import PublicBookingPage from "./pages/PublicBookingPage";
import BookingSuccess from "./pages/BookingSuccess";
import PublicQR from "./pages/PublicQR";
import Settings from "./pages/Settings";
import CustomersPage from "./pages/CustomersPage";
import { Navigate } from "react-router";
import HomePage from "./pages/HomePage";
const App = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    (async () => {
      await fetchUser();
    })();
  }, [fetchUser]);

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <Routes>
      <Route element={<RedirectedRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/customers" element={<CustomersPage />} />
      </Route>
      <Route path="/book/:restaurantId" element={<PublicBookingPage />} />
      <Route
        path="/restaurant/:restaurantId/booking-success/:bookingId"
        element={<BookingSuccess />}
      />
      <Route path="/restaurant/:restaurantId/qr" element={<PublicQR />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
