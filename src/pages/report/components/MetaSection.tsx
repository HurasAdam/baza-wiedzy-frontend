import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { statusConfig, type ReportStatus } from "@/utils/issue-report-status";
import { BugIcon, Calendar, CircleDot, Fingerprint, LightbulbIcon, Shapes, Users } from "lucide-react";

interface Props {
  report: any;
}

export function MetaSection({ report }: Props) {
  const status = statusConfig[report.status as ReportStatus];

  return (
    <div className="lg:w-88 lg:sticky lg:top-6 h-max space-y-4 mt-6 lg:mt-0">
      <Card className="p-6 shadow-lg w-full bg-background/95">
        <h3 className="text-md font-semibold mb-4 border-b border-border pb-2">Szczegóły zgłoszenia</h3>
        <div className="flex flex-col divide-y divide-border">
          {/* Zwykły div z typem zgłoszenia */}
          <div className="flex items-center gap-3 py-3">
            <div className="flex-shrink-0 p-2 rounded-md border bg-card">
              {report.type === "bug" ? (
                <BugIcon className="w-5 h-5 text-rose-600/65" />
              ) : (
                <LightbulbIcon className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div className="flex-1 flex justify-between items-center min-w-0">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {" "}
                {report.type === "bug" ? "Błąd" : "Propozycja"}
              </span>
            </div>
          </div>

          <MetaRow
            icon={<Fingerprint className="w-5 h-5 text-muted-foreground" />}
            label="ID zgłoszenia"
            value={`${report.ticketNumber}`}
          />
          <MetaRow
            icon={<CircleDot className="w-5 h-5 text-muted-foreground" />}
            label="Status"
            value={<Badge className={`${status.badge} border-none px-2 py-1`}>{status.label}</Badge>}
          />
          <CategoryMetaRow
            icon={<Shapes className="w-5 h-5 text-muted-foreground" />}
            label="Kategoria"
            slug={report.category.slug}
            slugValue={report.category.label}
          />
          <MetaRow
            icon={<Calendar className="w-5 h-5 text-muted-foreground" />}
            label="Data dodania"
            value={new Date(report.createdAt).toLocaleDateString("pl-PL")}
          />
          <MetaRow
            icon={<Users className="w-5 h-5 text-muted-foreground" />}
            label="Autor"
            value={
              <div>
                <p className="font-medium">
                  {report.createdBy.name} {report.createdBy.surname}
                </p>
                <p className="text-xs text-muted-foreground">{report.createdBy.email}</p>
              </div>
            }
          />
        </div>
      </Card>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex-shrink-0 p-2 rounded-md border bg-card">{icon}</div>
      <div className="flex-1 flex justify-between items-center min-w-0">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
        <span className="text-sm font-medium text-right">{value}</span>
      </div>
    </div>
  );
}

function CategoryMetaRow({ icon, slug, slugValue }: { icon: React.ReactNode; slug: string; slugValue: string }) {
  return (
    <div className="flex flex-col gap-2 py-3">
      {/* Nagłówek z ikoną i slug */}
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 flex items-center justify-center p-2 rounded-md bg-card border shadow-sm">
          {icon}
        </div>
        <span className="inline-block px-3 py-1 text-sm font-semibold text-primary bg-primary/10 rounded-full shadow-sm">
          {slug}
        </span>
      </div>

      {/* Dokładny label pod spodem */}
      <div className="ml-10">
        <span className="text-[13px] text-muted-foreground">{slugValue}</span>
      </div>
    </div>
  );
}
