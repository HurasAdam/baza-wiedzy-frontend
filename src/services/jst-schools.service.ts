import api from "@/config/api.client";
import type { JstSchoolForm } from "../components/jst-school/jst-school-modal";
import type { IJstSchool } from "../types";

const baseUrl = "/projects";

const create = async (id: string, formData: JstSchoolForm) => {
  return api.post(`${baseUrl}/${id}/schools`, formData);
};

const find = async (
  projectId: string | null,
  params: Record<string, string>
): Promise<IJstSchool[]> => {
  return api.get(`${baseUrl}/${projectId}/schools`, { params });
};

export const jstSchoolsService = {
  create,
  find,
};
