import api from "@/config/api.client";
const baseUrl = "/workspaces";
const adminBaseUrl = "/admin";

const createWorkspace = (payload) => {
  return api.post(`${baseUrl}`, payload);
};

const findOne = (workspaceId: string) => {
  return api.get(`${baseUrl}/${workspaceId}`);
};

const find = () => {
  return api.get(`${baseUrl}`);
};

export const workspaceService = {
  createWorkspace,
  find,
  findOne,
};
