import { useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useFindWorkspaceMembersQuery } from "../../hooks/workspace/use-workspace";
import WorkspaceInviteLinkSection from "./components/WorkspaceInviteLinkSection";
import WorkspaceManageMembersHeader from "./components/WorkspaceManageMembersHeader";
import WorkspaceMembersSection from "./components/WorkspaceMembersSection";

export const WorkspaceManageMembersPage = () => {
  const { workspaceId } = useParams();
  const { data: workspaceMembers, isLoading } = useFindWorkspaceMembersQuery(workspaceId);

  return (
    <div className="max-w-6xl mx-auto py-8  space-y-8">
      <WorkspaceManageMembersHeader />
      <Separator />

      {workspaceId && <WorkspaceInviteLinkSection workspaceId={workspaceId} />}

      <WorkspaceMembersSection workspaceMembers={workspaceMembers} isLoading={isLoading} />
    </div>
  );
};
