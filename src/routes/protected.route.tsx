// import useAuth from "@/hooks/api/use-auth";
import { Loader } from "@/components/Loader";
import { useAuthUserQuery } from "@/hooks/auth/use-auth";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { data: authData, isLoading } = useAuthUserQuery();

  if (isLoading) {
    return <Loader />;
  }
  return authData ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
