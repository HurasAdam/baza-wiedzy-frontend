import api from "@/config/api.client";

import type { IssueReport } from "@/types/issue-report";
import type { BugReportFormValues } from "../components/issue-report/bug-report-form";

const BASE_URL = "/issue-report";

const sendIssueReport = async (payload: BugReportFormValues) => {
  console.log("FORM DATA WYYSLANE TO :", payload);
  return api.post(BASE_URL, payload);
};

const find = async (params?: URLSearchParams): Promise<IssueReport[]> => {
  return api.get(BASE_URL, { params });
};

const findOne = async (issueReportId: string): Promise<IssueReport> => {
  return api.get(`${BASE_URL}/${issueReportId}`);
};

const updateStatus = ({ reportId, payload }: { reportId: string; payload: string }): Promise<void> => {
  return api.patch(`${BASE_URL}/${reportId}/status`, { status: payload });
};

export const issueReportsService = {
  sendIssueReport,
  find,
  findOne,
  updateStatus,
};
