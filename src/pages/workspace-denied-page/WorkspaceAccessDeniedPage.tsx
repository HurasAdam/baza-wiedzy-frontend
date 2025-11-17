import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

interface WorkspaceAccessDeniedProps {
  message?: string;
}

export const WorkspaceAccessDenied = ({
  message = "Nie masz dostępu do tej kolekcji.",
}: WorkspaceAccessDeniedProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-6">
      <div className="bg-card rounded-3xl shadow-lg p-12 max-w-lg w-full flex flex-col items-center animate-fadeIn">
        <div className="flex items-center justify-center w-24 h-24 bg-destructive/10 rounded-full mb-6">
          <AlertTriangle className="w-12 h-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground mb-4">Brak dostępu</h1>
        <p className="text-muted-foreground text-base mb-8">
          {message} <br />
          Sprawdź, czy używasz właściwego linku lub skontaktuj się z właścicielem kolekcji.
        </p>
        <Button onClick={handleGoBack} className="w-full md:w-auto px-6 py-3" size="lg">
          Wróć do BW
        </Button>
      </div>
    </div>
  );
};
