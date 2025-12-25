import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useUpdateWorkspaceMemberPermissionsMutation } from "../../hooks/workspace-members/use-workspace-member";
import type { WorkspaceMember } from "../../pages/workspace-manage-members/components/WorkspaceMembersSection";
import { WorkspaceUserPermissionsForm } from "./WorkspaceUserPermissionsForm";

const PERMISSION_LABELS: Record<string, string> = {
  addFolder: "Dodawanie folderów",
  editFolder: "Edycja folderów",
  deleteFolder: "Usuwanie folderów",
  addArticle: "Dodawanie artykułów",
  editArticle: "Edycja artykułów",
  deleteArticle: "Usuwanie artykułów",
  addMember: "Dodawanie użytkowników",
  removeMember: "Usuwanie użytkowników",
};

interface WorkspaceUserPermissionsModalProps {
  isOpen: boolean;
  member: WorkspaceMember;
  onClose: () => void;
  workspaceId: string;
  closeOnOutsideClick?: boolean;
}

export function WorkspaceUserPermissionsModal({
  member,
  isOpen,
  closeOnOutsideClick = false,
  onClose,
  workspaceId,
}: WorkspaceUserPermissionsModalProps) {
  const { mutate, isPending } = useUpdateWorkspaceMemberPermissionsMutation();

  const handleSubmit = (permissions: Record<string, boolean>) => {
    if (!member) return;

    mutate(
      { memberId: member._id, payload: { permissions } },
      {
        onSuccess: () => {
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Uprawnienia zostały zaktualizowane",
          });
          queryClient.invalidateQueries({ queryKey: ["workspace-members", workspaceId] });
          onClose();
        },
      }
    );
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="max-w-xl rounded-xl"
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <DialogTitle>Uprawnienia użytkownika</DialogTitle>
          </div>

          <p className="text-sm text-muted-foreground">
            {member?.name} {member?.surname} ({member?.email})
          </p>
        </DialogHeader>

        <div className="mt-6">
          <WorkspaceUserPermissionsForm
            defaultPermissions={member?.permissions || {}}
            labels={PERMISSION_LABELS}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSaving={isPending}
            isOwner={member?.isOwner}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
