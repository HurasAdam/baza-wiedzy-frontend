import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthRoute } from "./common/routePaths";
import { useAuthUserQuery } from "@/hooks/auth/use-auth";

export const AuthRoute = () => {
  const location = useLocation();
  const { data: authData, isLoading } = useAuthUserQuery();

  const _isAuthRoute = isAuthRoute(location.pathname);

  if (isLoading && !_isAuthRoute) return <div>LOADING...</div>;

  if (!authData) return <Outlet />;
  return <Navigate to={`/dashboard`} replace />;
};
