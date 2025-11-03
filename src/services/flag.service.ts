import type { JstProjectFormData } from "@/components/jst-project/jst-project-form";
import api from "@/config/api.client";
import type { Flag } from "../pages/flagged-articles/components/FlaggedArticlesListSection";
import type { IJstProject } from "../types";

const BASE_URL = "/flags";

const create = async (formData: unknown) => {
  return api.post(BASE_URL, formData);
};

const find = (params?: URLSearchParams): Promise<Flag[]> => {
  return api.get(BASE_URL, { params });
};

const findOne = (jstProjectId: string): Promise<IJstProject> => {
  return api.get(`${BASE_URL}/${jstProjectId}`);
};

const updateOne = (jstProjectId: string, data: JstProjectFormData): Promise<void> => {
  return api.put(`${BASE_URL}/${jstProjectId}`, data);
};

export const flagService = {
  find,
  create,
  findOne,
  updateOne,
};
