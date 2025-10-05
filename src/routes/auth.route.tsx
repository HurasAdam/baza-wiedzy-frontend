import { Navigate, Outlet } from "react-router-dom";

import { useAuthQuery } from "@/hooks/auth/use-auth";

export const AuthRoute = () => {
  const { data: authData, isLoading } = useAuthQuery();

  if (isLoading) return <Outlet />;

  if (authData) {
    return <Navigate to="/dashboard" replace />;
  }

  // ---- Domyślny fallback (zwraca Outlet dla publicznych tras) ----
  return <Outlet />;
};
