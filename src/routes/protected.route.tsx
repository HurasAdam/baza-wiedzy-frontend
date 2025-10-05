import { useAuthQuery } from "@/hooks/auth/use-auth";
import { Origami } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { CardHeader, CardTitle } from "../components/ui/card";

const ProtectedRoute = () => {
  const { data: authData, isLoading } = useAuthQuery();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="text-center animate-fade-in">
          <CardHeader className="text-center">
            <Origami className="mx-auto w-12 h-12 text-sidebar-logo/70 animate-spin-slow" />
            <CardTitle className="text-3xl font-bold text-foreground mt-2">Baza Wiedzy</CardTitle>
          </CardHeader>
          <p className="text-muted-foreground mt-2 text-sm">Wczytywanie danych… Proszę czekać</p>
        </div>
      </div>
    );
  }
  // Jeśli użytkownik musi zmienić hasło, ale NIE jest na /account-onboarding, przekieruj
  if (authData?.mustChangePassword && location.pathname !== "/account-onboarding") {
    return <Navigate to="/account-onboarding" replace />;
  }

  if (!authData) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
