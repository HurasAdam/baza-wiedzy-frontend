import { Loader } from "@/components/Loader";
import { useAuthQuery } from "@/hooks/auth/use-auth";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const { data: authData, isLoading } = useAuthQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!authData) {
    return <Navigate to="/auth/login" replace />;
  }

  const isAdmin = authData?.role?.name?.includes("ADMIN");

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
