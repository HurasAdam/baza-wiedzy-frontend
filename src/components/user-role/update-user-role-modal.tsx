import type { AxiosError } from "axios";
import { ShieldCheck, User } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useChangeUserRoleMutation, useFindRoles } from "../../hooks/users/use-users";
import type { UserShape } from "../../pages/admin-panel/admin-user-details/components/UserInfoTab";
import type { UpdateUserRoleFormData } from "../../validation/update-user-role.schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { UpdateUserRoleForm } from "./update-user-role-form";

interface CreateWorkspaceProps {
  userData: UserShape;
  isUpdatingUserRole: boolean;
  setIsUpdatingUserRole: () => void;
  closeOnOutsideClick?: boolean;
}

export const UpdateUserRoleModal = ({
  userData,
  isUpdatingUserRole,
  setIsUpdatingUserRole,
  closeOnOutsideClick,
}: CreateWorkspaceProps) => {
  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("includeAdmins", "false");
    return searchParams;
  }, []);

  const { data: roles = [], isLoading } = useFindRoles(params);
  const { mutate, isPending } = useChangeUserRoleMutation();

  const onSubmit = (data: UpdateUserRoleFormData) => {
    mutate(
      { userId: userData._id, data },
      {
        onSuccess: () => {
          setIsUpdatingUserRole();

          queryClient.invalidateQueries({ queryKey: ["user", userData._id] });
          toast.success("Rola użytkownika została zaktualizowana");
        },
        onError: (error) => {
          const { status } = error as AxiosError;
          if (status === 409) {
            toast.error("Taka rola już istnieje");
            return;
          }
          toast.error("Wystąpił błąd");
        },
      }
    );
  };

  return (
    <Dialog open={isUpdatingUserRole} onOpenChange={setIsUpdatingUserRole} modal={true}>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="max-h-[80vh] overflow-y-auto w-full max-w-lg rounded-2xl shadow-lg border border-border bg-background p-6"
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
            <span className="p-2 rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="w-5 h-5" />
            </span>
            Zmień rolę użytkownika
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Nadaj użytkownikowi nową rolę w systemie.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/30 my-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">
              {userData?.name} {userData?.surname}
            </p>
            <p className="font-medium"></p>
            <p className="text-xs text-muted-foreground">{userData?.email}</p>
          </div>
        </div>

        <UpdateUserRoleForm
          roles={roles}
          defaultValues={{ roleId: userData?.role?._id }}
          onSubmit={onSubmit}
          isSubmitting={isPending}
          submitText="Zapisz zmiany"
        />
      </DialogContent>
    </Dialog>
  );
};
