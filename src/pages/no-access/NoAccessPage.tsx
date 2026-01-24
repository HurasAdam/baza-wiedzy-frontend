import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NoAccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-background px-4">
      <div className="bg-card border rounded-3xl shadow-2xl p-12 max-w-md w-full text-center space-y-8">
        <div className="flex items-center mx-auto justify-center w-24 h-24 bg-destructive/10 rounded-full mb-6">
          <AlertTriangle className="w-12 h-12 text-destructive" />
        </div>

        <h1 className="text-3xl font-extrabold text-foreground">Brak dostępu</h1>

        <p className="text-md text-muted-foreground leading-relaxed">
          Nie masz uprawnień do tej strony.
          <br />
          Skontaktuj się z administratorem lub wróć do dashboardu.
        </p>

        <Button variant="default" size="lg" className="w-full" onClick={() => navigate("/dashboard")}>
          Powrót do dashboardu
        </Button>
      </div>
    </div>
  );
};
