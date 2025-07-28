import api from "@/config/api.client";

import type { IssueReport, IssueReportFormData } from "@/types/issue-report";

const BASE_URL = "/issue-report";

const sendIssueReport = async ({
  formData,
}: {
  formData: IssueReportFormData;
}) => {
  return api.post(BASE_URL, { ...formData });
};

const find = async (params?: URLSearchParams): Promise<IssueReport[]> => {
  return api.get(BASE_URL, { params });
};

const findOne = async (issueReportId: string): Promise<IssueReport> => {
  return api.get(`${BASE_URL}/${issueReportId}`);
};

export const issueReportsService = {
  sendIssueReport,
  find,
  findOne,
};
