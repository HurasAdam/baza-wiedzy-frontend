import api from "@/config/api.client";
import type { FunnyMessageForm } from "../components/funny-messages/funny-message-modal";

const BASE_URL = "/issue-report";

const sendIssueReport = async ({ formData }: FunnyMessageForm) => {
  console.log(formData, "PRESEND DATA");
  return api.post(BASE_URL, formData);
};

const find = async (params?: URLSearchParams) => {
  return api.get(BASE_URL, { params });
};

const findOne = async (issueReportId: string) => {
  return api.get(`${BASE_URL}/${issueReportId}`);
};

export const issueReportsService = {
  sendIssueReport,
  find,
  findOne,
};
