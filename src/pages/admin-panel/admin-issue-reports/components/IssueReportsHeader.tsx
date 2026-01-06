import { Separator } from "@/components/ui/separator";
import { MessageSquareWarning, X } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import type { IssueStatus, IssueType } from "../admin-issue-reports";
import IssueReportsFilters from "./IssueReportsFilters";

interface IssueReportsHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: IssueType;
  filterStatus: IssueStatus;
  setFilterType: (value: IssueType) => void;
  setFilterStatus: (value: IssueStatus) => void;
  foundReportsCount: number;
}

const IssueReportsHeader = ({
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  searchTerm,
  setSearchTerm,
  foundReportsCount,
}: IssueReportsHeaderProps) => {
  const hasActiveFilters = !!filterType || !!filterStatus;

  return (
    <div className="mb-6 space-y-4">
      {/* Context */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <MessageSquareWarning className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-2xl font-semibold tracking-tight">Zgłoszenia</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">Lista zgłoszonych błędów i propozycji.</p>
      </header>

      {/* Active filters – meta state */}
      <div className="flex items-center gap-2 flex-wrap text-sm min-h-[32px]">
        {hasActiveFilters ? (
          <>
            <span className="text-muted-foreground mr-1">Aktywne filtry:</span>

            {filterType && (
              <Badge variant="secondary" className="gap-1">
                Typ: <strong>{filterType === "bug" ? "Błąd" : "Propozycja"}</strong>
                <button onClick={() => setFilterType("")}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {filterStatus && (
              <Badge variant="secondary" className="gap-1">
                Status:
                <strong>
                  {filterStatus === "pending" && "Oczekujące"}
                  {filterStatus === "in-progress" && "W trakcie"}
                  {filterStatus === "resolved" && "Rozwiązane"}
                  {filterStatus === "rejected" && "Odrzucone"}
                </strong>
                <button onClick={() => setFilterStatus("")}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </>
        ) : (
          <Badge variant="outline" className="text-muted-foreground gap-1">
            <MessageSquareWarning className="w-4 h-4" />
            Wszystkie zgłoszenia
          </Badge>
        )}
      </div>

      <Separator />

      {/* Controls */}
      <div className="bg-card border rounded-xl p-4">
        <IssueReportsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          filterStatus={filterStatus}
          setFilterType={setFilterType}
          setFilterStatus={setFilterStatus}
          foundReportsCount={foundReportsCount}
        />
      </div>
    </div>
  );
};

export default IssueReportsHeader;
