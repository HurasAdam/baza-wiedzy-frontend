// import useAuth from "@/hooks/api/use-auth";
import { useAuthUserQuery } from "@/hooks/auth/use-auth";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { data: authData, isLoading } = useAuthUserQuery();

  if (isLoading) {
    return <div>LOADING...</div>;
  }
  return authData ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
