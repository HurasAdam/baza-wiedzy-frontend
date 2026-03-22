import { Loader } from "@/components/Loader";
import { useAuthQuery } from "@/hooks/auth/use-auth";
import { Navigate, Outlet } from "react-router-dom";

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
