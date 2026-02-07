import { motion } from "framer-motion";
import { useOutletContext, useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import * as animation from "../../constants/animations";
import { useFindWorkspaceInviteCandidatesQuery } from "../../hooks/workspace-members/use-workspace-member";
import { useFindWorkspaceMembersQuery } from "../../hooks/workspace/use-workspace";
import WorkspaceInviteLinkSection from "./components/WorkspaceInviteLinkSection";
import WorkspaceManageMembersHeader from "./components/WorkspaceManageMembersHeader";
import WorkspaceMembersSection from "./components/WorkspaceMembersSection";
export const WorkspaceManageMembersPage = () => {
  const { workspaceId } = useParams();

  const { workspace, permissions } = useOutletContext();
  const { data: workspaceMembers, isLoading } = useFindWorkspaceMembersQuery(workspaceId);
  const { data: workspaceInviteCandidates } = useFindWorkspaceInviteCandidatesQuery(workspaceId!);

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="max-w-6xl mx-auto py-8  space-y-8"
    >
      <WorkspaceManageMembersHeader workspaceId={workspaceId} permissions={permissions} />
      <Separator />

      {workspaceId && <WorkspaceInviteLinkSection inviteCode={workspace.inviteCode} />}

      <WorkspaceMembersSection
        workspaceMembers={workspaceMembers}
        workspaceId={workspaceId}
        isLoading={isLoading}
        permissions={permissions}
      />
    </motion.div>
  );
};
