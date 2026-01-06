import { useMutation, useQuery } from "@tanstack/react-query";
import { issueReportCommentsService } from "../../services/issue-report-comments.service";

export const useSendIssueReportCommentMutation = () => {
  return useMutation({
    mutationFn: ({ reportId, payload }: { reportId: string; payload: string }) =>
      issueReportCommentsService.sendReportComment(reportId, payload),
  });
};

export const useFindReportCommentsQuery = (reportId: string) => {
  return useQuery({
    queryKey: ["report-comments", reportId],
    queryFn: () => {
      return issueReportCommentsService.findComments(reportId);
    },
  });
};
