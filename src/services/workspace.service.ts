import api from "@/config/api.client";
import type { WorkspaceInviteFormData } from "../components/workspace-invite/WorkspaceInviteModal";
import type { WorkspaceDataForm } from "../validation/workspace.schema";
const baseUrl = "/workspaces";

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

const removeMember = (workspaceId: string, memberId: string): Promise<void> => {
  return api.delete(`${baseUrl}/${workspaceId}/members/${memberId}`);
};

const joinWorkspaceByInviteCode = (inviteCode: WorkspaceInviteFormData) => {
  return api.post(`${baseUrl}/join`, inviteCode);
};

const deleteWorkspace = (workspaceId: string) => {
  return api.delete(`${baseUrl}/${workspaceId}`);
};

export const workspaceService = {
  createWorkspace,
  updateWorkspace,
  find,
  findOne,
  findMembers,
  removeMember,
  joinWorkspaceByInviteCode,
  deleteWorkspace,
};
