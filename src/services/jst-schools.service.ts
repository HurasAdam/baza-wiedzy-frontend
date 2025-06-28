import api from "@/config/api.client";
import type { IJstSchool } from "../types";

const baseUrl = "/projects";

const find = async (
  projectId: string | null,
  params: Record<string, string>
): Promise<IJstSchool[]> => {
  return api.get(`${baseUrl}/${projectId}/schools`, { params });
};

export const jstSchoolsService = {
  find,
};
