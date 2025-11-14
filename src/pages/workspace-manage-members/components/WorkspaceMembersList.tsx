import { Card } from "@/components/ui/card";
import { WorkspaceMemberCard } from "./WorkspaceMemberCard";
import type { WorkspaceMember } from "./WorkspaceMembersSection";

interface WorkspaceMembersListProps {
  isLoading: boolean;
  workspaceMembers: WorkspaceMember[];
}

export const WorkspaceMembersList = ({ workspaceMembers, isLoading }: WorkspaceMembersListProps) => {
  if (isLoading) return <p className="text-sm text-muted-foreground">Ładowanie listy użytkowników...</p>;
  if (!workspaceMembers?.length)
    return <Card className="p-6 text-center text-muted-foreground">Brak użytkowników do wyświetlenia.</Card>;

  return (
    <div className="divide-y divide-border rounded-lg border">
      {workspaceMembers.map((member) => (
        <WorkspaceMemberCard key={member._id} member={member} />
      ))}
    </div>
  );
};
