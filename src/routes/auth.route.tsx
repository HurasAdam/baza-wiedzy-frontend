import { Navigate, Outlet } from "react-router-dom";

import { useAuthQuery } from "@/hooks/auth/use-auth";
import { Loader } from "@/components/Loader";

export const AuthRoute = () => {
  const { data: authData, isLoading } = useAuthQuery();

  if (isLoading) return <Loader />;

  if (authData) {
    return <Navigate to="/dashboard" replace />;
  }

  // ---- Domyślny fallback (zwraca Outlet dla publicznych tras) ----
  return <Outlet />;
};
