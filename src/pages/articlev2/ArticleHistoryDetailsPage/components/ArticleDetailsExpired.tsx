import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import React from "react";

interface ExpiredItem {
  statusChange?: {
    from: string;
    to: string;
  };
  createdAt?: string; // data wykonania akcji
}

interface Props {
  item?: ExpiredItem;
}

// Statusy po polsku
const statusPL: Record<string, string> = {
  approved: "Zatwierdzony",
  pending: "Wymagający weryfikacji",
  expired: "Wygasł",
};

export const ArticleDetailsExpired: React.FC<Props> = ({ item }) => {
  if (!item) return <div>Brak danych o tym wpisie historii</div>;

  const actionDate = item.createdAt ? new Date(item.createdAt) : null;

  return (
    <Card className="p-6 flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-background text-muted-foreground">
          <Clock className="w-6 h-6 text-amber-500/70" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">Artykuł wymaga ponownej weryfikacji</h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Status artykułu został automatycznie zmieniony z <strong>{statusPL[item.statusChange?.from ?? "—"]}</strong>{" "}
            na <strong>{statusPL[item.statusChange?.to ?? "—"]}</strong>.
          </p>

          {actionDate && (
            <p className="text-xs text-muted-foreground/80 mt-1">Data wykonania akcji: {actionDate.toLocaleString()}</p>
          )}

          <p className="text-sm text-muted-foreground/80 italic mt-2 leading-relaxed">
            Zmiana została wykonana automatycznie przez system (CRON), ponieważ od ostatniej weryfikacji artykułu minęło
            ponad 12 miesięcy.
          </p>
        </div>
      </div>
    </Card>
  );
};
