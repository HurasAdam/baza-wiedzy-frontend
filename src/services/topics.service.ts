import api from "@/config/api.client";
import type { ITopic } from "../types/topic";
const baseUrl = "/conversation-topics";

export const find = (params: Record<string, string>): Promise<ITopic[]> => {
  // title, produst params
  return api.get(baseUrl, { params });
};

export const topicsService = {
  find,
};
