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
  return (
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
  );
};

export default IssueReportsHeader;
