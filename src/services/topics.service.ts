import api from "@/config/api.client";
import type { topicFormData } from "../components/topic/topic-modal";
import type { ITopic } from "../types/topic";
const baseUrl = "/conversation-topics";

export const create = (data: topicFormData) => {
  return api.post(baseUrl, data);
};

export const find = (params: URLSearchParams): Promise<ITopic[]> => {
  // title, produst params
  return api.get(baseUrl, { params });
};

export const findOne = (topicId: string): Promise<ITopic> => {
  // title, produst params
  return api.get(`${baseUrl}/${topicId}`);
};

export const updateOne = (topicId, data): Promise<void> => {
  return api.put(`${baseUrl}/${topicId}`, data);
};

export const topicsService = {
  create,
  find,
  findOne,
  updateOne,
};
