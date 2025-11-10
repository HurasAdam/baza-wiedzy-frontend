import { useMutation, useQuery } from "@tanstack/react-query";
import { workspaceService } from "../../services/workspace.service";

export const useFindUserWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["my-workspaces"],
    queryFn: () => {
      return workspaceService.find();
    },
  });
};

export const useFindWorkspaceQuery = (workspaceId?: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => workspaceService.findOne(workspaceId!),
    enabled: !!workspaceId, // odpala się dopiero, gdy workspaceId istnieje
  });
};
export const useCreateWorkspaceMutation = () => {
  return useMutation({
    mutationFn: (payload) => {
      return workspaceService.createWorkspace(payload);
    },
  });
};
