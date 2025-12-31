import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GlobalNotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-background via-background/90 to-background/60 px-6">
      <AlertCircle className="w-24 h-24 text-muted-foreground/60 mb-6 animate-pulse" />

      <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 text-center">
        404 — Nie znaleziono strony
      </h1>

      <p className="text-center text-muted-foreground max-w-md mb-8">
        Wydaje nam się, że strona, której szukasz, nie istnieje lub została przeniesiona. Sprawdź adres URL lub wróć na
        stronę główną.
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
