import { useState } from "react";
import { toast } from "sonner";
import { Alert } from "../../../components/shared/alert-modal";
import { WorkspaceUserPermissionsModal } from "../../../components/workspace-user-permissions/WorkspaceUserPermissionsModal";
import queryClient from "../../../config/query.client";
import { useRemoveWorkspaceMemberMutation } from "../../../hooks/workspace/use-workspace";
import { WorkspaceMembersList } from "./WorkspaceMembersList";

export interface WorkspaceMember {
  _id: string;
  name: string;
  surname: string;
  email: string;
  isOwner: boolean;
  permissions: Record<string, boolean>;
}

interface WorkspaceMembersSectionProps {
  isLoading: boolean;
  workspaceMembers: WorkspaceMember[];
  workspaceId: string;
}

const WorkspaceMembersSection = ({ isLoading, workspaceMembers, workspaceId }: WorkspaceMembersSectionProps) => {
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(null);
  const { mutate: removeMember, isPending: isRemoving } = useRemoveWorkspaceMemberMutation();

  const handleConfirmRemove = () => {
    if (!memberToRemove) return;

    removeMember(
      { workspaceId, memberId: memberToRemove._id },
      {
        onSuccess: () => {
          toast.success("Użytkownik został usunięty z kolekcji");
          queryClient.invalidateQueries({ queryKey: ["workspace-members", workspaceId] });
          setMemberToRemove(null);
        },
        onError: (err: any) => {
          toast.error(err?.message || "Nie udało się usunąć użytkownika");
        },
      }
    );
  };

  const handleCancelRemove = () => setMemberToRemove(null);
  const handleCancelEdit = () => setSelectedMember(null);
  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground mb-3">Lista użytkowników</h2>

      <WorkspaceMembersList
        workspaceMembers={workspaceMembers}
        isLoading={isLoading}
        workspaceId={workspaceId}
        onRequestRemove={setMemberToRemove}
        onRequestEdit={setSelectedMember}
      />

      <Alert
        isOpen={!!memberToRemove}
        onCancel={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        isLoading={isRemoving}
        title="Potwierdzenie usunięcia użytkownika"
        type="warning"
      >
        <p>
          Czy na pewno chcesz usunąć{" "}
          <strong>
            {memberToRemove?.name} {memberToRemove?.surname}
          </strong>{" "}
          z tej kolekcji?
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Po usunięciu użytkownik straci dostęp do zasobów tej kolekcji.
        </p>
      </Alert>

      {selectedMember && (
        <WorkspaceUserPermissionsModal
          isOpen={!!selectedMember}
          onClose={handleCancelEdit}
          member={selectedMember}
          workspaceId={workspaceId}
        />
      )}
    </section>
  );
};

export default WorkspaceMembersSection;
