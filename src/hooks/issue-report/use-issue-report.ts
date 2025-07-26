import { issueReportsService } from "@/services/issue-report.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSendIssueReportMutation = () => {
  return useMutation({
    mutationFn: (data) => issueReportsService.sendIssueReport(data),
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
