import { useFindIssueReportsQuery } from "@/hooks/issue-report/use-issue-report";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import IssueReportsHeader from "./components/IssueReportsHeader";
import IssueReportsList from "./components/IssueReportsList";

export type IssueType = "" | "bug" | "proposal";
export type IssueStatus = "" | "pending" | "in-progress" | "resolved" | "rejected";

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

  return (
    <div className="mx-auto pb-6">
      <IssueReportsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        foundReportsCount={reports.length}
      />

      <IssueReportsList reports={reports} isLoading={isLoading} isError={isError} error={error} navigate={navigate} />
    </div>
  );
};
