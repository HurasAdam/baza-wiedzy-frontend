import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GlobalBadRequestPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-background via-background/90 to-background/60 px-6">
      <AlertTriangle className="w-24 h-24 text-muted-foreground mb-6 animate-pulse" />

      <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 text-center">
        Nieprawidłowy identyfikator
      </h1>

      <p className="text-center text-muted-foreground max-w-md mb-8">
        Podany identyfikator jest niepoprawny. Sprawdź URL lub wróć do listy artykułów.
      </p>

      <Button
        size="lg"
        onClick={() => navigate("/")}
        className="bg-card text-foreground font-medium rounded-lg shadow-md hover:bg-card/90 transition-colors duration-200"
      >
        Wróć na stronę główną
      </Button>
    </div>
  );
}
