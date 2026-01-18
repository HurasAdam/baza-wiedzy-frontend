import api from "@/config/api.client";

import type { IJstSchool, JstSchoolCreateData } from "../types";

const baseUrl = "/projects";

const create = async (id: string, formData: JstSchoolCreateData) => {
  return api.post(`${baseUrl}/${id}/schools`, formData);
};

const find = async (projectId: string | null, params: Record<string, string>): Promise<IJstSchool[]> => {
  return api.get(`${baseUrl}/${projectId}/schools`, { params });
};

const deleteOne = ({ projectId, schoolId }: { projectId: string; schoolId: string }) => {
  return api.delete(`${baseUrl}/${projectId}/schools/${schoolId}`);
};

export const jstSchoolsService = {
  create,
  find,
  deleteOne,
};
