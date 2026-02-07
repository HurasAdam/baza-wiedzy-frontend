import { useMutation, useQuery } from "@tanstack/react-query";
import type { WorkspaceAddMemberFormData } from "../../components/workspace-invite/WorkspaceAddMemberModal";
import { workspaceMembersService } from "../../services/workspace-members.service";

export const useUpdateWorkspaceMemberPermissionsMutation = () => {
  return useMutation({
    mutationFn: ({ memberId, payload }: { memberId: string; payload: unknown }) => {
      return workspaceMembersService.updatePermissions(memberId, payload);
    },
  });
};

export const useAddWorkspaceMemberMutation = () => {
  return useMutation({
    mutationFn: ({ workspaceId, payload }: { workspaceId: string; payload: WorkspaceAddMemberFormData }) => {
      return workspaceMembersService.addWorkspaceMember({ workspaceId, payload });
    },
  });
};

export const useFindCurrentWorkspaceMemberQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["current-workspace-member"],
    queryFn: () => {
      return workspaceMembersService.findCurrentWorkspaceMember(workspaceId);
    },
  });
};

export const useFindWorkspaceInviteCandidatesQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-invite-candidates", workspaceId],
    queryFn: () => {
      return workspaceMembersService.findWorkspaceInviteCandidates(workspaceId);
    },
  });
};
