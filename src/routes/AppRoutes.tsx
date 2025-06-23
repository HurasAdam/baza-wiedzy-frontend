import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthRoute } from "./auth.route";
import { protectedRoutePaths } from "./routes";

import AppLayout from "@/layouts/app/app.layout";
import BaseLayout from "@/layouts/base/base.layout";
import { PAGES } from "@/pages";
import AdminLayout from "../layouts/admin/admin.layout";
import AdminDashboard from "../pages/admin-panel/admin-dashboard";
import AdminProtectedRoute from "./admin.protected.route";
import ProtectedRoute from "./protected.route";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publiczne ścieżki dostępne TYLKO dla niezalogowanych */}
        <Route element={<AuthRoute />}>
          <Route path="auth" element={<BaseLayout />}>
            <Route path="login" element={<PAGES.LoginPage />} />
            <Route
              path="forgot-password"
              element={<PAGES.ForgotPasswordPage />}
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        </Route>

        {/* Chronione ścieżki dostępne TYLKO dla zalogowanych */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {protectedRoutePaths.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            {/* Tutaj 404 dla zalogowanych na nieznane ścieżki */}
            <Route path="*" element={<PAGES.NotFoundPage />} />
          </Route>
        </Route>

        {/* Ochrona admin panelu */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
