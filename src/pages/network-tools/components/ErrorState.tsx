import { Network } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface Props {
  onRetry: () => void;
}

export const ErrorState = ({ onRetry }: Props) => {
  return (
    <div className="mt-10 flex flex-col items-center justify-center text-center py-14 px-6 border border-destructive/10 rounded-2xl bg-muted/20">
      <div className="mb-4 p-4 rounded-full bg-destructive/5 shadow-sm">
        <Network className="w-8 h-8 text-destructive/70" />
      </div>

      <h3 className="text-lg font-semibold mb-2 text-foreground/95">Nie udało się pobrać rekordów DNS</h3>

      <p className="text-sm text-muted-foreground max-w-md mb-6">
        Wystąpił problem podczas komunikacji z serwerem DNS. Sprawdź poprawność domeny lub wybierz inny server DNS.
      </p>

      <Button variant="outline" onClick={onRetry} className="h-9 px-5">
        Spróbuj ponownie
      </Button>
    </div>
  );
};
