import api from "@/config/api.client";
import type { reportTopicForm } from "../pages/TopicRegister/forms/register-topic-form";
const baseUrl = "/conversation-report";

const createTopicReport = async (data: reportTopicForm) => {
  return api.post(baseUrl, data);
};

export const reportsTopicService = {
  createTopicReport,
};
