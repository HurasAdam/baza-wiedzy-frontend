import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthRoute } from "./common/routePaths";
import { useAuthUserQuery } from "@/hooks/auth/use-auth";
import { Loader } from "@/components/Loader";

export const AuthRoute = () => {
  const location = useLocation();
  const { data: authData, isLoading } = useAuthUserQuery();

  const _isAuthRoute = isAuthRoute(location.pathname);

  if (isLoading) return <Loader />;

  if (!authData) {
    // 🔓 Użytkownik niezalogowany
    if (_isAuthRoute) {
      return <Outlet />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // ✅ Zalogowany użytkownik, nie powinien być na auth-routach
  if (_isAuthRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  // 👇 WAŻNE: domyślny fallback (zwraca Outlet dla publicznych tras)
  return <Outlet />;
};
