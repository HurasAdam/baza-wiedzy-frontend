import api from "@/config/api.client";
const baseUrl = "/workspace-members";

const updatePermissions = (memberId: string, payload: Record<string, boolean>) => {
  return api.patch(`${baseUrl}/${memberId}/permissions`, payload);
};

export const workspaceMembersService = {
  updatePermissions,
};
