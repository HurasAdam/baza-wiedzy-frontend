import api from "@/config/api.client";
import type { FolderData } from "../pages/workspace-folder-page/components/WorkspaceFolderHeader";
import type { Folder } from "../pages/workspace-manage-folders/components/ManageFoldersFilters";
import type { WorkspaceFolderFormData } from "../validation/workspace-folder.schema";
const baseUrl = "/workspace-folders";

const createWorkspaceFolder = ({ workspaceId, payload }: { workspaceId: string; payload: WorkspaceFolderFormData }) => {
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

const findWorkspaceFolders = (workspaceId: string, searchParams?: URLSearchParams): Promise<Folder[]> => {
  return api.get(`${baseUrl}/${workspaceId}/folders`, { params: searchParams });
};

const findOneWorkspaceFolder = (workspaceId: string, folderId: string): Promise<FolderData> => {
  return api.get(`${baseUrl}/${workspaceId}/folders/${folderId}`);
};

const deleteOneWorkspaceFolder = (workspaceId: string, folderId: string): Promise<FolderData> => {
  return api.delete(`${baseUrl}/${workspaceId}/folders/${folderId}`);
};

export const workspaceFoldersService = {
  createWorkspaceFolder,
  findWorkspaceFolders,
  findOneWorkspaceFolder,
  editWorkspaceFolder,
  deleteOneWorkspaceFolder,
};
