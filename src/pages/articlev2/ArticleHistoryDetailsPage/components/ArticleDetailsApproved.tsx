import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { formatDate } from "../../../../utils/format-date";

interface VerifiedChange {
  field: string;
  oldValue: any;
  newValue: any;
  _id: string;
  statusChange?: { from: string; to: string };
}

interface ArticleHistoryVerifiedProps {
  changes: VerifiedChange[];
  verifiedBy: { name: string; surname: string };
  verifiedAt: string;
}

const statusLabels: Record<string, string> = {
  approved: "Zatwierdzony",
  pending: "Wymaga weryfikacji",
  rejected: "Wymagający poprawy",
  draft: "Szkic roboczy",
};

export const ArticleDetailsApproved = ({ changes, verifiedBy, verifiedAt }: ArticleHistoryVerifiedProps) => {
  if (!changes || changes.length === 0) return <div>Brak zmian</div>;

  const statusChange = changes.find((c) => c.field === "statusChange");
  const statusField = changes.find((c) => c.field === "status");

  const previousStatus = statusChange?.statusChange?.from || statusField?.oldValue || "—";
  const newStatus = statusChange?.statusChange?.to || statusField?.newValue || "—";

  return (
    <Card className="p-6 flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-background text-muted-foreground">
          <CheckCircle className="w-6 h-6 text-green-500/70" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">Artykuł został zweryfikowany</h1>

          <p className="text-sm text-muted-foreground/80 leading-relaxed italic">
            Zmiana wykonana przez{" "}
            <strong>
              {verifiedBy.name} {verifiedBy.surname}
            </strong>{" "}
            • {formatDate(verifiedAt)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col gap-1 p-3 bg-muted/5 rounded-lg">
              <span className="font-medium text-foreground/90">Poprzedni status</span>
              <span className="text-muted-foreground">{statusLabels[previousStatus] || previousStatus}</span>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-muted/5 rounded-lg">
              <span className="font-medium text-foreground/90">Nowy status</span>
              <span className="text-muted-foreground">{statusLabels[newStatus] || newStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
