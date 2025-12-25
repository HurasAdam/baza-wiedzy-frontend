import { useMutation, useQuery } from "@tanstack/react-query";
import { workspaceMembersService } from "../../services/workspace-members.service";

export const useUpdateWorkspaceMemberPermissionsMutation = () => {
  return useMutation({
    mutationFn: ({ memberId, payload }: { memberId: string; payload: unknown }) => {
      return workspaceMembersService.updatePermissions(memberId, payload);
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
