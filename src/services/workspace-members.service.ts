import api from "@/config/api.client";
const baseUrl = "/workspace-members";

const updatePermissions = (memberId: string, payload: Record<string, boolean>) => {
  return api.patch(`${baseUrl}/${memberId}/permissions`, payload);
};

const findCurrentWorkspaceMember = (workspaceId: string) => {
  return api.get(`${baseUrl}/me/${workspaceId}`);
};

export const workspaceMembersService = {
  updatePermissions,
  findCurrentWorkspaceMember,
};
