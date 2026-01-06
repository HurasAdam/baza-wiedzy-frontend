import api from "@/config/api.client";
import type { Comment } from "../pages/report/components/CommentListSection";

const BASE_URL = "/report-comments";

const sendReportComment = (reportId: string, payload: string) => {
  return api.post(`${BASE_URL}/${reportId}`, { content: payload });
};

const findComments = (reportId: string): Promise<Comment[]> => {
  return api.get(`${BASE_URL}/${reportId}`);
};

export const issueReportCommentsService = {
  sendReportComment,
  findComments,
};
