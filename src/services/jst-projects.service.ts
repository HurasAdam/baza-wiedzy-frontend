import api from "@/config/api.client";
import type { JstProjectForm } from "../components/jst-project/jst-project-modal";
import type { IJstProject } from "../types";
import type { JstProjectFormData } from "@/components/jst-project/jst-project-form";

const BASE_URL = "/projects";

const create = async (formData: JstProjectForm) => {
  return api.post(BASE_URL, formData);
};

const find = (params: URLSearchParams): Promise<IJstProject[]> => {
  return api.get(BASE_URL, { params });
};

const findOne = (jstProjectId: string): Promise<IJstProject> => {
  return api.get(`${BASE_URL}/${jstProjectId}`);
};

const updateOne = (
  jstProjectId: string,
  data: JstProjectFormData
): Promise<void> => {
  return api.put(`${BASE_URL}/${jstProjectId}`, data);
};

export const jstProjectsService = {
  find,
  create,
  findOne,
  updateOne,
};
