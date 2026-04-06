import { useMutation, useQuery } from "@tanstack/react-query";
import { pinnedWorkspacesService } from "../../services/pinned-workspaces.service";

export const useCreatePinnedWorkspaceMutation = () => {
  return useMutation({
    mutationFn: (payload) => {
      return pinnedWorkspacesService.create(payload);
    },
  });
};

export const useDeletePinnedWorkspaceMutation = () => {
  return useMutation({
    mutationFn: (pinnedWorkspaceId: string) => {
      return pinnedWorkspacesService.deleteOne(pinnedWorkspaceId);
    },
  });
};

export const useFindUserPinnedWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["my-pinned-workspaces"],
    queryFn: () => {
      return pinnedWorkspacesService.find();
    },
  });
};
