import api from "@/config/api.client";
import type { JstProjectForm } from "../components/jst-project/jst-project-modal";
import type { IJstProject } from "../types";

const BASE_URL = "/projects";

const create = async (formData: JstProjectForm) => {
  return api.post(BASE_URL, formData);
};

const find = (): Promise<IJstProject[]> => {
  return api.get(BASE_URL);
};

export const jstProjectsService = {
  find,
  create,
};
