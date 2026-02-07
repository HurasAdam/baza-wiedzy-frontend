import type { AxiosError } from "axios";
import { Lock, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import {
  WorkspaceAddMemberModal,
  type WorkspaceAddMemberFormData,
} from "../../../components/workspace-invite/WorkspaceAddMemberModal";
import queryClient from "../../../config/query.client";
import { useAddWorkspaceMemberMutation } from "../../../hooks/workspace-members/use-workspace-member";

interface Props {
  workspaceId?: string;
  permissions: Record<string, boolean>;
}

const WorkspaceManageMembersHeader = ({ workspaceId, permissions }: Props) => {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState<boolean>(false);
  const { mutate: addWorkspaceMemberMutate, isPending: isAddMemberLoading } = useAddWorkspaceMemberMutation();

  const onAddMember = () => {
    setIsAddMemberModalOpen(true);
  };

  const onAddMemberConfirm = (data: WorkspaceAddMemberFormData) => {
    console.log(data);

    if (!workspaceId) return;
    addWorkspaceMemberMutate(
      { workspaceId, payload: data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["workspace-members", workspaceId] });
          setIsAddMemberModalOpen(false);
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Dodano nowego użytkownika kolekcji",
          });
        },
        onError: (error) => {
          const { status } = error as AxiosError;

          if (status === 409) {
            toast.error(
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontFamily: "Inter, sans-serif",
                  color: "#991b1b",
                  fontSize: "14px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Wystąpił błąd</div>
                  <div style={{ opacity: 0.8 }}>Wybrany użytkownik należy już do tej kolekcji</div>
                </div>
              </div>,
              { duration: 7000, position: "bottom-right" },
            );
            return;
          } else if (status === 403) {
            toast.error("Brak uprawnień", {
              description: "Nie posiadasz wymaganych uprawnień do wykonania tej operacji.",
              position: "bottom-right",
              duration: 7000,
            });
            return;
          }

          toast.error("Wystapił błąd, spróbuj ponownie");
        },
      },
    );
  };

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Users className="w-6 h-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">Użytkownicy dodani do kolekcji</h1>
      </div>

      <Button
        onClick={() => {
          if (!permissions?.addMember) return;
          onAddMember();
        }}
        className={!permissions?.addMember ? "opacity-50 cursor-not-allowed" : ""}
        title={!permissions?.addMember ? "Brak uprawnień do dodania użytkowników" : ""}
      >
        {!permissions?.addMember ? (
          <>
            <Lock className="w-4 h-4 text-primary-foreground pointer-events-none" /> Dodaj użytkownika
          </>
        ) : (
          <>
            <Plus /> Dodaj użytkownika
          </>
        )}
      </Button>

      {isAddMemberModalOpen && (
        <WorkspaceAddMemberModal
          isOpen={isAddMemberModalOpen}
          setIsOpen={setIsAddMemberModalOpen}
          onSave={onAddMemberConfirm}
          isLoading={isAddMemberLoading}
          workspaceId={workspaceId!}
        />
      )}
    </header>
  );
};

export default WorkspaceManageMembersHeader;
