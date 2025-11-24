import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AppLayout from "./components/AppLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DailyLogPage from "./pages/DailyLogPage";
import FoodLibraryPage from "./pages/FoodLibraryPage";
import WeeklyPage from "./pages/WeeklyPage";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="daily-log/:date" element={<DailyLogPage />} />
        <Route path="foods" element={<FoodLibraryPage />} />
        <Route path="weekly-checkin" element={<WeeklyPage />} />
      </Route>

      {/* Redirect unknown routes to dashboard if logged in or login if not */}
      <Route path="*" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
    </Routes>
  );
}
