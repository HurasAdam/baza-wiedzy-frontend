import { useMutation } from "@tanstack/react-query";
import { workspaceMembersService } from "../../services/workspace-members.service";

export const useUpdateWorkspaceMemberPermissionsMutation = () => {
  return useMutation({
    mutationFn: ({ memberId, payload }: { memberId: string; payload: unknown }) => {
      return workspaceMembersService.updatePermissions(memberId, payload);
    },
  });
};
