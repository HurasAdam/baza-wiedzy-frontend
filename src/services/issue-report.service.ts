import api from "@/config/api.client";
import type { FunnyMessageForm } from "../components/funny-messages/funny-message-modal";
import type { FindFunnyMessagesResponse } from "../types/funny-message";

const BASE_URL = "/issue-report";

const sendIssueReport = async (formData: FunnyMessageForm) => {
  return api.post(BASE_URL, formData);
};

const find = async (params?: URLSearchParams) => {
  return api.get(BASE_URL, { params });
};

export const issueReportsService = {
  sendIssueReport,
  find,
};
