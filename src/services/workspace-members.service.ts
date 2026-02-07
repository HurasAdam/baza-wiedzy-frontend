import api from "@/config/api.client";
import type { WorkspaceAddMemberFormData } from "../components/workspace-invite/WorkspaceAddMemberModal";
const baseUrl = "/workspace-members";

const updatePermissions = (memberId: string, payload: Record<string, boolean>) => {
  return api.patch(`${baseUrl}/${memberId}/permissions`, payload);
};

const findCurrentWorkspaceMember = (workspaceId: string) => {
  return api.get(`${baseUrl}/me/${workspaceId}`);
};

const findWorkspaceInviteCandidates = (workspaceId: string) => {
  return api.get(`${baseUrl}/candidates/${workspaceId}`);
};

const addWorkspaceMember = ({ workspaceId, payload }: { workspaceId: string; payload: WorkspaceAddMemberFormData }) => {
  return api.post(`${baseUrl}/${workspaceId}/addMember`, payload);
};

export const workspaceMembersService = {
  updatePermissions,
  findCurrentWorkspaceMember,
  findWorkspaceInviteCandidates,
  addWorkspaceMember,
};
