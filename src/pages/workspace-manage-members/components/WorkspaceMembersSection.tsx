import { WorkspaceMembersList } from "./WorkspaceMembersList";

export interface WorkspaceMember {
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
}

interface WorkspaceMembersSectionProps {
  isLoading: boolean;
  workspaceMembers: WorkspaceMember[];
}

const WorkspaceMembersSection = ({ isLoading, workspaceMembers }: WorkspaceMembersSectionProps) => {
  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground mb-3">Lista użytkowników</h2>

      <WorkspaceMembersList workspaceMembers={workspaceMembers} isLoading={isLoading} />
    </section>
  );
};

export default WorkspaceMembersSection;
