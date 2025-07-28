import { issueReportsService } from "@/services/issue-report.service";
import type { IssueReportFormData } from "@/types/issue-report";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSendIssueReportMutation = () => {
  return useMutation({
    mutationFn: (data: IssueReportFormData) =>
      issueReportsService.sendIssueReport(data),
  });
};

export const useFindIssueReportsQuery = (params?: URLSearchParams) => {
  return useQuery({
    queryKey: ["issue-reports", params?.toString()],
    queryFn: () => {
      return issueReportsService.find(params);
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindIssueReportQuery = (issueReportId: string) => {
  return useQuery({
    queryKey: ["issue-report", issueReportId],
    queryFn: () => {
      return issueReportsService.findOne(issueReportId);
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
