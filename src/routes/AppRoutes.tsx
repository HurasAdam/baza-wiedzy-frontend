import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthRoute } from "./auth.route";
import { protectedRoutePaths } from "./routes";

import ProtectedRoute from "./protected.route";
import AppLayout from "@/layouts/app/app.layout";
import BaseLayout from "@/layouts/base/base.layout";
import { PAGES } from "@/pages";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publiczne ścieżki dostępne TYLKO dla niezalogowanych */}
        <Route element={<AuthRoute />}>
          <Route path="auth" element={<BaseLayout />}>
            <Route path="login" element={<PAGES.LoginPage />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        </Route>

        {/* Chronione ścieżki dostępne TYLKO dla zalogowanych */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {protectedRoutePaths.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            {/* Tutaj 404 dla zalogowanych na nieznane ścieżki */}
            <Route path="*" element={<PAGES.NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
