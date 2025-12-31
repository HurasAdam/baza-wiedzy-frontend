import { Button } from "@/components/ui/button";
import { Server } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GlobalServerErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-background via-background/90 to-background/60 px-6">
      <Server className="w-28 h-28 text-muted-foreground mb-6 " />

      <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 text-center tracking-wide">
        Serwer chwilowo <br /> niedostępny
      </h1>

      <p className="text-center text-muted-foreground max-w-md mb-8 leading-relaxed">
        Wystąpił problem po stronie serwera. Spróbuj odświeżyć stronę za chwilę lub wróć później.
      </p>

      <Button
        size="lg"
        onClick={() => navigate("/")}
        className="bg-card text-foreground font-medium rounded-lg shadow-lg hover:bg-card/90 transition-all duration-200 ring-1 ring-primary/20"
      >
        Wróć na stronę główną
      </Button>
    </div>
  );
}
