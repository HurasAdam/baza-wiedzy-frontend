import { Loader } from "@/components/Loader";
import { useAuthQuery } from "@/hooks/auth/use-auth";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

const AdminProtectedRoute = () => {
  const { data: authData, isLoading } = useAuthQuery();
  const [hasShownToast, setHasShownToast] = useState(false);

  if (isLoading) return <Loader />;

  if (!authData) return <Navigate to="/auth/login" replace />;

  const canAccessAdminPanel = authData.role?.permissions?.includes("ACCESS_ADMIN_PANEL");

  if (!canAccessAdminPanel) {
    if (!hasShownToast) {
      toast.warning(
        () => (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-medium text-base">Brak uprawnień</span>
              <span className="text-sm font-normal ">Panel admina dostępny tylko dla uprawnionych użytkowników.</span>
            </div>
          </div>
        ),
        {
          duration: 3000,
        }
      );
      setHasShownToast(true);
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
