import api from "@/config/api.client";

const baseUrl = "/pinned-workspaces";

export const create = (data: unknown) => {
  return api.post(baseUrl, data);
};

export const find = () => {
  return api.get(baseUrl);
};
export const findOne = (pinnedLinkId: string) => {
  return api.get(`${baseUrl}/${pinnedLinkId}`);
};

export const updateOne = (pinnedLinkId: string, payload: unknown) => {
  return api.patch(`${baseUrl}/${pinnedLinkId}`, payload);
};

export const deleteOne = (pinnedWorkspaceId: string) => {
  return api.delete(`${baseUrl}/${pinnedWorkspaceId}`);
};

export const pinnedWorkspacesService = {
  create,
  find,
  deleteOne,
};
