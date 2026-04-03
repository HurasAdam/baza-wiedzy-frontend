import { Network } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="mt-10 flex flex-col items-center justify-center text-center py-16 border border-dashed border-border/60 rounded-2xl bg-muted/20">
      <div className="mb-4 p-4 rounded-full bg-background shadow-sm">
        <Network className="w-8 h-8 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold mb-2 text-foreground/95">Wyszukaj rekordy DNS</h3>

      <p className="text-sm text-muted-foreground max-w-md">
        Wprowadź domenę, wybierz server DNS oraz typ rekordu, aby rozpocząć analizę. Wyniki pojawią się tutaj.
      </p>
    </div>
  );
};

export default EmptyState;
