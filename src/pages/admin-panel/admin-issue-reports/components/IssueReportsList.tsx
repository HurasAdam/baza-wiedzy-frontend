import { Bug, Ellipsis, Lightbulb, Loader } from "lucide-react";
import { toast } from "sonner";
import { Dropdown } from "../../../../components/Dropdown";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { statusConfig, type ReportStatus } from "../../../../utils/issue-report-status";

interface IssueReportAuthor {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

export interface Report {
  _id: string;
  ticketNumber?: string;
  title: string;
  description: string;
  createdBy: IssueReportAuthor;
  status: string;
  type: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface IssueReportsListProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  reports: Report[];
  navigate: (url: string) => void;
}

const IssueReportsList = ({ isLoading, isError, error, reports, navigate }: IssueReportsListProps) => {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin w-6 h-6" />
        </div>
      )}

      {isError && (
        <p className="text-destructive text-center py-10">
          {(error as Error)?.message || "Błąd podczas ładowania zgłoszeń"}
        </p>
      )}

      {!isLoading && !isError && reports.length === 0 && (
        <p className="text-center py-10 text-muted-foreground">Brak zgłoszeń</p>
      )}

      {!isLoading && !isError && reports.length > 0 && (
        <ul className="divide-y divide-border">
          {reports.map((report) => {
            const status = statusConfig[report.status as ReportStatus];
            return (
              <li
                key={report._id}
                className="flex items-center justify-between px-4 py-3 group hover:bg-muted/30 transition-all
             bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm border-b last:border-b-0 rounded-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-md ${
                      report.type === "bug" ? "bg-red-500/20" : "bg-yellow-400/20"
                    }`}
                  >
                    {report.type === "bug" ? (
                      <Bug className="w-4 h-4 text-red-500" />
                    ) : (
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>

                  {report.ticketNumber && (
                    <div
                      className="flex items-center justify-center
               w-14 h-9 shrink-0
                text-muted-foreground font-mono font-semibold text-xs
               rounded-lg"
                      title={`Nr zgłoszenia: ${report.ticketNumber}`}
                    >
                      <span className="truncate">{report.ticketNumber}</span>
                    </div>
                  )}

                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">{report.title}</span>

                    <span
                      className="inline-flex items-center px-2 py-[1px] mt-1 rounded-full text-[9px] font-medium uppercase tracking-wide w-fit
                   bg-muted/10 text-muted-foreground border border-muted/20"
                    >
                      {report.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={`${status.badge} border-none px-2 py-1`}>{status.label}</Badge>
                    <div className="w-28" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      • {new Date(report.createdAt).toLocaleDateString("pl-PL")}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-border/40 mx-2"></div>

                  <Dropdown
                    withSeparators
                    triggerBtn={
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition">
                        <Ellipsis className="w-4 h-4" />
                      </Button>
                    }
                    options={[
                      {
                        label: "Szczegóły",
                        icon: <Bug className="w-4 h-4" />,
                        actionHandler: () => navigate(`/reports/${report._id}`),
                      },
                      {
                        label: "Usuń",
                        icon: <Bug className="w-4 h-4 text-red-500" />,
                        actionHandler: () => toast.error(`Usuń ${report.title}`),
                      },
                    ]}
                    position={{ align: "end" }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default IssueReportsList;
