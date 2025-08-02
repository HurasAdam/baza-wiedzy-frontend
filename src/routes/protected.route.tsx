import { useAuthQuery } from "@/hooks/auth/use-auth";
import { Loader } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { data: authData, isLoading } = useAuthQuery();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  // Jeśli użytkownik musi zmienić hasło, ale NIE jest na /account-onboarding, przekieruj
  if (
    authData?.mustChangePassword &&
    location.pathname !== "/account-onboarding"
  ) {
    return <Navigate to="/account-onboarding" replace />;
  }

  if (!authData) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
