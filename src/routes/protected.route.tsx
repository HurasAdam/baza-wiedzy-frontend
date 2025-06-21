// import useAuth from "@/hooks/api/use-auth";
import { Loader } from "@/components/Loader";
import { useAuthQuery } from "@/hooks/auth/use-auth";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { data: authData, isLoading } = useAuthQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!authData) {
    return <Navigate to="/auth/login" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
