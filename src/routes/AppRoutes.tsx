import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthRoute } from "./auth.route";
import { authRoutePaths, protectedRoutePaths } from "./routes";

import ProtectedRoute from "./protected.route";
import BaseLayout from "@/layouts/base/base.layout";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRoute />} />
        <Route element={<BaseLayout />}>
          {authRoutePaths.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          })}
        </Route>

        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<BaseLayout />}>
            {protectedRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
