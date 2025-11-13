import api from "@/config/api.client";
import type { FolderData } from "../pages/workspace-folder-page/components/WorkspaceFolderHeader";
const baseUrl = "/workspace-folders";
const adminBaseUrl = "/admin";

const createWorkspaceFolder = ({ workspaceId, payload }) => {
  return api.post(`${baseUrl}/${workspaceId}`, payload);
};
const editWorkspaceFolder = ({
  workspaceId,
  folderId,
  payload,
}: {
  workspaceId: string;
  folderId: string;
  payload: unknown;
}) => {
  return api.patch(`${baseUrl}/${workspaceId}/folders/${folderId}`, payload);
};

const findWorkspaceFolders = (workspaceId: string) => {
  return api.get(`${baseUrl}/${workspaceId}/folders`);
};

const findOneWorkspaceFolder = (workspaceId: string, folderId: string): Promise<FolderData> => {
  return api.get(`${baseUrl}/${workspaceId}/folders/${folderId}`);
};

export const workspaceFoldersService = {
  createWorkspaceFolder,
  findWorkspaceFolders,
  findOneWorkspaceFolder,
  editWorkspaceFolder,
};
