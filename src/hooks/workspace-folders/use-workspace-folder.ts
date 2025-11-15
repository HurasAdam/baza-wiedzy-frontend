import { useMutation, useQuery } from "@tanstack/react-query";
import { workspaceFoldersService } from "../../services/workspace-folders.service";

export const useCreateWorkspaceFolderMutation = () => {
  return useMutation({
    mutationFn: ({ workspaceId, payload }: { workspaceId: string; payload: { name: string } }) => {
      return workspaceFoldersService.createWorkspaceFolder({ workspaceId, payload });
    },
  });
};

export const useEditWorkspaceFolderMutation = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      folderId,
      payload,
    }: {
      workspaceId: string;
      folderId: string;
      payload: { name: string };
    }) => {
      return workspaceFoldersService.editWorkspaceFolder({ workspaceId, folderId, payload });
    },
  });
};

export const useDeleteWorkspaceFolderMutation = () => {
  return useMutation({
    mutationFn: ({ workspaceId, folderId }: { workspaceId: string; folderId: string }) => {
      return workspaceFoldersService.deleteOneWorkspaceFolder(workspaceId, folderId);
    },
  });
};

export const useFindWorkspaceFoldersQuery = (workspaceId: string, searchParams?: URLSearchParams) => {
  return useQuery({
    queryKey: ["workspace-folders", workspaceId, searchParams?.toString() ?? ""],
    queryFn: () => {
      return workspaceFoldersService.findWorkspaceFolders(workspaceId, searchParams);
    },
    enabled: !!workspaceId,
  });
};

export const useFindOneWorkspaceFolderQuery = (workspaceId: string, folderId: string) => {
  return useQuery({
    queryKey: ["workspace-folders", workspaceId, folderId],
    queryFn: () => {
      return workspaceFoldersService.findOneWorkspaceFolder(workspaceId, folderId);
    },
    enabled: !!workspaceId,
  });
};
