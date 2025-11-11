import api from "@/config/api.client";
import type { WorkspaceDataForm } from "../validation/workspace.schema";
const baseUrl = "/workspaces";
const adminBaseUrl = "/admin";

const createWorkspace = (payload: WorkspaceDataForm) => {
  return api.post(`${baseUrl}`, payload);
};

const updateWorkspace = (payload: { workspaceId: string; data: WorkspaceDataForm }) => {
  return api.patch(`${baseUrl}/${payload.workspaceId}`, payload.data);
};

const findOne = (workspaceId: string) => {
  return api.get(`${baseUrl}/${workspaceId}`);
};

const find = () => {
  return api.get(`${baseUrl}`);
};

const findMembers = (workspaceId: string) => {
  return api.get(`${baseUrl}/${workspaceId}/members`);
};

export const workspaceService = {
  createWorkspace,
  updateWorkspace,
  find,
  findOne,
  findMembers,
};
