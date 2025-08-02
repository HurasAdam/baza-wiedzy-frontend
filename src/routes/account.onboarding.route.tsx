import { Navigate, Outlet } from "react-router-dom";
import { useAuthQuery } from "@/hooks/auth/use-auth";
import { Loader } from "@/components/Loader";

export const AccountOnboardingRoute = () => {
  const { data: authData, isLoading } = useAuthQuery();

  if (isLoading) return <Loader />;

  if (!authData) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!authData.mustChangePassword) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
