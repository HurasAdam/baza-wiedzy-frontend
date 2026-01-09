import { Card } from "@/components/ui/card";
import { WorkspaceMemberCard } from "./WorkspaceMemberCard";
import type { WorkspaceMember } from "./WorkspaceMembersSection";

interface WorkspaceMembersListProps {
  isLoading: boolean;
  workspaceMembers: WorkspaceMember[];
  workspaceId: string;
  onRequestRemove: (member: WorkspaceMember) => void;
  onRequestPromote: (member: WorkspaceMember) => void;
  onRequestEdit: (member: WorkspaceMember) => void;
  permissions: Record<string, boolean>;
}

export const WorkspaceMembersList = ({
  workspaceMembers,
  isLoading,
  workspaceId,
  onRequestRemove,
  onRequestPromote,
  onRequestEdit,
  permissions,
}: WorkspaceMembersListProps) => {
  if (isLoading) return <p className="text-sm text-muted-foreground">Ładowanie listy użytkowników...</p>;
  if (!workspaceMembers?.length)
    return <Card className="p-6 text-center text-muted-foreground">Brak użytkowników do wyświetlenia.</Card>;

  return (
    <div className="divide-y divide-border rounded-lg border">
      {workspaceMembers.map((member) => (
        <WorkspaceMemberCard
          key={member._id}
          member={member}
          workspaceId={workspaceId}
          onRequestRemove={onRequestRemove}
          onRequestPromote={onRequestPromote}
          onRequestEdit={onRequestEdit}
          permissions={permissions}
        />
      ))}
    </div>
  );
};
