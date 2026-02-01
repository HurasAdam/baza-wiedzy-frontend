import { useFindIssueReportsQuery } from "@/hooks/issue-report/use-issue-report";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import * as animation from "../../constants/animations";
import { useAuthQuery } from "../../hooks/auth/use-auth";
import IssueReportsHeader from "../admin-panel/admin-issue-reports/components/IssueReportsHeader";
import IssueReportsList from "../admin-panel/admin-issue-reports/components/IssueReportsList";

export type IssueType = "" | "bug" | "proposal";
export type IssueStatus = "" | "open" | "resolved" | "closed";

export const ReportsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<IssueType>("");
  const [filterStatus, setFilterStatus] = useState<IssueStatus>("");

  const { data: user } = useAuthQuery();

  const userPermissions = user?.role?.permissions || [];

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (filterType) searchParams.append("type", filterType);
    if (filterStatus) searchParams.append("status", filterStatus);
    if (searchTerm) searchParams.append("title", searchTerm);
    return searchParams;
  }, [filterStatus, filterType, searchTerm]);

  const { data: reports = [], isLoading, isError, error } = useFindIssueReportsQuery(params);
  const { onOpenCreateIssueReport } = useOutletContext<{ onOpenCreateIssueReport: () => void }>();
  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="mx-auto pb-5 max-w-[1320px] flex flex-col bg-gradient-to-br from-background via-background/90 to-background/60 backdrop-blur-md"
    >
      <IssueReportsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        foundReportsCount={reports.length}
        openSendIssueReportModal={onOpenCreateIssueReport}
        userPermissions={userPermissions}
      />

      <IssueReportsList reports={reports} isLoading={isLoading} isError={isError} error={error} navigate={navigate} />
    </motion.div>
  );
};
