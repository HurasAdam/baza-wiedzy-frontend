import { Bug, Ellipsis, Lightbulb, Loader } from "lucide-react";
import { toast } from "sonner";
import { Dropdown } from "../../../../components/Dropdown";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

interface IssueReportAuthor {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

interface Report {
  _id: string;
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

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Oczekujące";
    case "in-progress":
      return "W trakcie";
    case "resolved":
      return "Rozwiązane";
    case "rejected":
      return "Odrzucone";
    default:
      return status;
  }
};

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

      {!isLoading && !isError && reports.length === 0 && <p className="text-center py-10">Brak zgłoszeń</p>}

      {!isLoading && !isError && reports.length > 0 && (
        <ul className="divide-y divide-border">
          {reports.map((report) => (
            <li
              key={report._id}
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition group"
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                {report.type === "bug" ? (
                  <Bug className="w-5 h-5 text-red-500" />
                ) : (
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{report.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {report.createdBy.name} {report.createdBy.surname} •{" "}
                    {new Date(report.createdAt).toLocaleDateString("pl-PL")}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-14">
                <div className="flex items-center gap-10">
                  <Badge variant="secondary">{report.category}</Badge>
                  <Badge variant="outline">{getStatusLabel(report.status)}</Badge>
                </div>

                {/* Actions */}
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
                      actionHandler: () => navigate(`/admin/manage-reports/${report._id}`),
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
          ))}
        </ul>
      )}
    </div>
  );
};

export default IssueReportsList;
