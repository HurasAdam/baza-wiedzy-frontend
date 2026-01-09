import { useMutation, useQuery } from "@tanstack/react-query";
import type { WorkspaceInviteFormData } from "../../components/workspace-invite/WorkspaceInviteModal";
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
    enabled: !!workspaceId,
  });
};

export const useFindWorkspaceMembersQuery = (workspaceId?: string) => {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => workspaceService.findMembers(workspaceId!),
    enabled: !!workspaceId,
  });
};
export const useCreateWorkspaceMutation = () => {
  return useMutation({
    mutationFn: (payload) => {
      return workspaceService.createWorkspace(payload);
    },
  });
};

export const useUpdateWorkspaceMutation = () => {
  return useMutation({
    mutationFn: (payload) => {
      return workspaceService.updateWorkspace(payload);
    },
  });
};

export const useJoinWorkspaceMutation = () => {
  return useMutation({
    mutationFn: (payload: WorkspaceInviteFormData) => {
      return workspaceService.joinWorkspaceByInviteCode(payload);
    },
  });
};

export const useRemoveWorkspaceMemberMutation = () => {
  return useMutation({
    mutationFn: ({ workspaceId, memberId }: { workspaceId: string; memberId: string }) => {
      return workspaceService.removeMember(workspaceId, memberId);
    },
  });
};

export const useDeleteWorkspaceMutation = () => {
  return useMutation({
    mutationFn: (workspaceId: string) => {
      return workspaceService.deleteWorkspace(workspaceId);
    },
  });
};

export const useChangeWorkspaceOwnerMutation = () => {
  return useMutation({
    mutationFn: ({ workspaceId, memberId }: { workspaceId: string; memberId: string }) => {
      return workspaceService.changeOwner(workspaceId, memberId);
    },
  });
};
