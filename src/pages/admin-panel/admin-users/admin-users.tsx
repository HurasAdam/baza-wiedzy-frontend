import {
  useDisableUserAccountMutation,
  useEnableUserAccountMutation,
  useFindRoles,
  useFindUsers,
  useResetUserPasswordMutation,
} from "@/hooks/users/use-users";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserAccountModal } from "../../../components/user-account/user-account-modal";
import queryClient from "../../../config/query.client";
import { UserActionDialog } from "./components/UserActionDialog";
import { type IUser } from "./components/userList-item-card";
import { UsersFilters } from "./components/UsersFilters";
import { UsersHeader } from "./components/UsersHeader";
import { UsersList } from "./components/UsersList";

export type ActionType = "RESET_PASSWORD" | "TOGGLE_ACCOUNT";
export interface PendingAction {
  type: ActionType;
  user: IUser;
}

export const UsersPage = () => {
  const navigate = useNavigate();

  const [isCreatingUserAccount, setIsCreatingUserAccount] = useState<boolean>(false);

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: roles = [] } = useFindRoles();

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (selectedRole) searchParams.append("role", selectedRole);

    if (selectedStatus) {
      const isActive = selectedStatus === "active" ? "true" : "false";
      searchParams.append("isActive", isActive);
    }

    if (searchTerm) searchParams.append("name", searchTerm);
    return searchParams;
  }, [selectedRole, selectedStatus, searchTerm]);

  const { data: users = [], isLoading, isError, error } = useFindUsers(params);
  const { mutate: resetUserPasswordMutation, isPending: isResetPasswordLoading } = useResetUserPasswordMutation();
  const { mutate: disableUserAccountMutation, isPending: isDisableAccountLoading } = useDisableUserAccountMutation();
  const { mutate: enableUserAccountMutation, isPending: isEnableAccountLoading } = useEnableUserAccountMutation();

  const onConfirm = () => {
    if (!pendingAction) return;
    const { type, user } = pendingAction;

    if (type === "RESET_PASSWORD") {
      resetUserPasswordMutation(user._id, {
        onSuccess: () => toast.success(`Hasło użytkownika ${user.name} ${user.surname} zostało zresetowane`),
        onError: () => toast.error("Podczas resetowania hasła wystąpił błąd, spróbuj ponownie"),
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          setPendingAction(null);
        },
      });
    } else {
      const fn = user.isActive ? disableUserAccountMutation : enableUserAccountMutation;
      fn(user._id, {
        onSuccess: () =>
          toast.success(
            `Konto użytkownika ${user.name} ${user.surname} zostało ${user.isActive ? "wyłączone" : "włączone"}`
          ),
        onError: () => toast.error("Podczas zmiany statusu konta wystąpił błąd, spróbuj ponownie."),
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          setPendingAction(null);
        },
      });
    }
  };

  const onCreateUserAccountRequest = () => {
    setIsCreatingUserAccount(true);
  };

  const onRequestReset = (user: IUser) => setPendingAction({ type: "RESET_PASSWORD", user });

  const onRequestToggle = (user: IUser) => setPendingAction({ type: "TOGGLE_ACCOUNT", user });

  return (
    <div className="mx-auto pb-6">
      <UsersHeader
        roles={roles}
        selectedRole={selectedRole}
        selectedStatus={selectedStatus}
        setSelectedRole={setSelectedRole}
        setSelectedStatus={setSelectedStatus}
        onAddUser={onCreateUserAccountRequest}
        onManageRoles={() => navigate("/admin/manage-roles")}
      />

      <UsersFilters
        roles={roles}
        usersCount={users.length}
        role={selectedRole}
        status={selectedStatus}
        search={searchTerm}
        onChange={({ role, status, search }) => {
          setSelectedRole(role);
          setSelectedStatus(status);
          setSearchTerm(search);
        }}
      />

      <UsersList
        isLoading={isLoading}
        isError={isError}
        users={users}
        onRequestReset={onRequestReset}
        onRequestToggle={onRequestToggle}
      />

      {pendingAction && (
        <UserActionDialog
          pendingAction={pendingAction}
          isLoading={isResetPasswordLoading || isDisableAccountLoading || isEnableAccountLoading}
          onConfirm={onConfirm}
          onCancel={() => setPendingAction(null)}
        />
      )}

      <UserAccountModal
        roles={roles}
        isCreatingUserAccount={isCreatingUserAccount}
        setIsCreatingUserAccount={setIsCreatingUserAccount}
      />
    </div>
  );
};
