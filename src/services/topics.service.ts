import api from "@/config/api.client";
import type { topicForm } from "../components/topic/topic-modal";
import type { ITopic } from "../types/topic";
const baseUrl = "/conversation-topics";

export const create = (data: topicForm) => {
  return api.post(baseUrl, data);
};

export const find = (params: Record<string, string>): Promise<ITopic[]> => {
  // title, produst params
  return api.get(baseUrl, { params });
};

export const topicsService = {
  create,
  find,
};
