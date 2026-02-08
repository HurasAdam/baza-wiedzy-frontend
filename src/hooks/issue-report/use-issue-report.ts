import { issueReportsService } from "@/services/issue-report.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSendIssueReportMutation = () => {
  return useMutation({
    mutationFn: (payload) => issueReportsService.sendIssueReport(payload),
  });
};

export const useUpdateReportStatusMutation = () => {
  return useMutation({
    mutationFn: ({ reportId, payload }: { reportId: string; payload: string }) =>
      issueReportsService.updateStatus({ reportId, payload }),
  });
};

export const useDeleteIssueReportMutation = () => {
  return useMutation({
    mutationFn: (reportId: string) => {
      return issueReportsService.deleteIssueReport(reportId);
    },
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
