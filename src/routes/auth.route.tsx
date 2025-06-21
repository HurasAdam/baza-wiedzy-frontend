import { Navigate, Outlet } from "react-router-dom";

import { useAuthQuery } from "@/hooks/auth/use-auth";
import { Loader } from "@/components/Loader";

export const AuthRoute = () => {
  const { data: authData, isLoading } = useAuthQuery();

  if (isLoading) return <Loader />;

  // ✅ Zalogowany użytkownik, nie powinien być na auth-routach
  if (authData) {
    return <Navigate to="/dashboard" replace />;
  }

  // 👇 WAŻNE: domyślny fallback (zwraca Outlet dla publicznych tras)
  return <Outlet />;
};
