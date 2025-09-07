import { Dropdown } from "@/components/Dropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFindIssueReportsQuery } from "@/hooks/issue-report/use-issue-report";
import { Bug, Ellipsis, Lightbulb, Loader, MessageSquareWarning, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type IssueType = "" | "bug" | "proposal";
type IssueStatus = "" | "pending" | "in-progress" | "resolved" | "rejected";

export const AdminUserReportsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<IssueType>("");
  const [filterStatus, setFilterStatus] = useState<IssueStatus>("");

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (filterType) searchParams.append("type", filterType);
    if (filterStatus) searchParams.append("status", filterStatus);
    if (searchTerm) searchParams.append("title", searchTerm);
    return searchParams;
  }, [filterStatus, filterType, searchTerm]);

  const { data: reports = [], isLoading, isError, error } = useFindIssueReportsQuery(params);

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

  return (
    <div className="mx-auto pb-6">
      {/* Header */}
      <div className="bg-background flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <MessageSquareWarning className="w-6 h-6 text-muted-foreground" />
              Zgłoszenia użytkowników
            </h1>

            <div className="flex gap-2 pt-2.5 flex-wrap px-2 h-6 mb-3">
              {filterType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filterType === "bug" && "Błąd"}
                  {filterType === "proposal" && "Propozycja"}

                  <button
                    onClick={() => setFilterType("")}
                    className="hover:text-destructive"
                    aria-label="Usuń filtr typu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Badge>
              )}

              {filterStatus && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filterStatus === "pending" && "Oczekujące"}
                  {filterStatus === "in-progress" && "W trakcie"}
                  {filterStatus === "resolved" && "Rozwiązane"}
                  {filterStatus === "rejected" && "Odrzucone"}

                  <button
                    onClick={() => setFilterStatus("")}
                    className="hover:text-destructive"
                    aria-label="Usuń filtr statusu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex px-3 py-2 gap-3 items-center flex-wrap">
          {/* Wyszukiwanie */}
          <Input
            placeholder="Wyszukaj zgłoszenie"
            className="w-48 border-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={filterType === "" ? "all" : filterType}
            onValueChange={(value) => setFilterType(value === "all" ? "" : (value as IssueType))}
          >
            <SelectTrigger className="w-40 border-ring">
              <SelectValue placeholder="Typ zgłoszenia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              <SelectItem value="bug">Błąd</SelectItem>
              <SelectItem value="proposal">Propozycja</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterStatus === "" ? "all" : filterStatus}
            onValueChange={(value) => setFilterStatus(value === "all" ? "" : (value as IssueStatus))}
          >
            <SelectTrigger className="w-40 border-ring">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              <SelectItem value="pending">Oczekujące</SelectItem>
              <SelectItem value="in-progress">W trakcie</SelectItem>
              <SelectItem value="resolved">Rozwiązane</SelectItem>
              <SelectItem value="rejected">Odrzucone</SelectItem>
            </SelectContent>
          </Select>
          {/* --- Reset Filters Button ----*/}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setFilterType("");
              setFilterStatus("");
            }}
          >
            Resetuj filtry
          </Button>
          <Badge variant="outline" className="ml-auto">
            Znaleziono: {reports.length}
          </Badge>
        </div>
      </div>

      {/* Reports List */}
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
    </div>
  );
};
