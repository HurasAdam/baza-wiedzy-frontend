import api from "@/config/api.client";

const baseUrl = "/conversation-report";

const createTopicReport = async (data: reportTopicForm) => {
  return api.post(baseUrl, data);
};

export const reportsTopicService = {
  createTopicReport,
};
