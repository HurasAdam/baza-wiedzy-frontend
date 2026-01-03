import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "../../../utils/format-date";

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

export const ArticleHistoryDetailsVerified = ({ changes, verifiedBy, verifiedAt }: ArticleHistoryVerifiedProps) => {
  if (!changes || changes.length === 0) return <div>Brak zmian</div>;

  const statusChange = changes.find((c) => c.field === "statusChange");
  const statusField = changes.find((c) => c.field === "status");

  return (
    <div className="space-y-6 ">
      <Card>
        <CardHeader>
          <CardTitle>Artykuł został zweryfikowany</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
          {statusChange ? (
            <>
              <div>
                <strong>Poprzedni status:</strong>{" "}
                {statusLabels[statusChange.statusChange?.from!] || statusChange.statusChange?.from}
              </div>
              <div>
                <strong>Nowy status:</strong>{" "}
                {statusLabels[statusChange.statusChange?.to!] || statusChange.statusChange?.to}
              </div>
            </>
          ) : statusField ? (
            <>
              <div>
                <strong>Poprzedni status:</strong> {statusLabels[statusField.oldValue] || statusField.oldValue}
              </div>
              <div>
                <strong>Nowy status:</strong> {statusLabels[statusField.newValue] || statusField.newValue}
              </div>
            </>
          ) : (
            <div>Brak informacji o zmianie statusu</div>
          )}

          {/* Informacja kto i kiedy */}
          {verifiedBy && verifiedAt && (
            <>
              <div>
                <strong>Zweryfikowane przez:</strong> {verifiedBy.name} {verifiedBy.surname}
              </div>
              <div>
                <strong>Data weryfikacji:</strong> {formatDate(verifiedAt)}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
