import { Dropdown } from "@/components/Dropdown";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useDisableUserAccountMutation,
  useEnableUserAccountMutation,
  useFindRoles,
  useFindUsers,
  useResetUserPasswordMutation,
} from "@/hooks/users/use-users";
import { Loader, Plus, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Alert } from "../../../components/shared/alert-modal";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { UserAccountModal } from "../../../components/user-account/user-account-modal";
import queryClient from "../../../config/query.client";
import { iconMap } from "../../../constants/role-icons";
import UserListItemCard, { type IUser } from "./components/userList-item-card";

const triggerBtn = (
  <Button variant="default" className="flex items-center gap-1 cursor-pointer">
    Dodaj <Plus className="w-4 h-4" />
  </Button>
);

export type ActionType = "RESET_PASSWORD" | "TOGGLE_ACCOUNT";
export interface PendingAction {
  type: ActionType;
  user: IUser;
}

export const UsersPage = () => {
  const navigate = useNavigate();

  //  --- Create User Account state ---
  const [isCreatingUserAccount, setIsCreatingUserAccount] = useState<boolean>(false);
  // -- Alert state --
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  // -- Filter State --
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: roles = [] } = useFindRoles();

  // const selectedRoleObj = selectedRole
  //   ? roles.find((r: { _id: string; name: string; iconKey: string; labelColor: string }) => r._id === selectedRole)
  //   : null;

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

  // --- Alert confirmation handler ---
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

  // --- open create user account modal ---
  const onCreateUserAccountRequest = () => {
    setIsCreatingUserAccount(true);
  };
  // --- open reset password alert ---
  const onRequestReset = (user: IUser) => setPendingAction({ type: "RESET_PASSWORD", user });
  // --- open emable/disable account alert ---
  const onRequestToggle = (user: IUser) => setPendingAction({ type: "TOGGLE_ACCOUNT", user });

  return (
    <div className="mx-auto pb-6">
      <div className="bg-background z-10 flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Users className="text-muted-foreground" /> Użytkownicy
            </h1>

            <div className="flex gap-2 pt-2.5 flex-wrap px-2 h-6 mb-3">
              {/* Selected role badge: pokazujemy nazwę roli + ikonę w kolorze labelColor + X */}
              {selectedRole &&
                (() => {
                  const role = roles.find((r) => r._id === selectedRole);
                  if (!role) return null;
                  const Icon = iconMap[role.iconKey];
                  return (
                    <Badge variant="secondary" className={`flex items-center gap-1 text-${role.labelColor}-600`}>
                      <Icon className="w-4 h-4" />
                      {role.name}
                      <button
                        onClick={() => setSelectedRole(null)}
                        className="hover:text-destructive"
                        aria-label="Usuń filtr roli"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </Badge>
                  );
                })()}

              {/* Selected status badge */}
              {selectedStatus && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedStatus === "active" && "Aktywni"}
                  {selectedStatus === "inactive" && "Nieaktywni"}

                  <button
                    onClick={() => setSelectedStatus(null)}
                    className="hover:text-destructive"
                    aria-label="Usuń filtr statusu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Badge>
              )}
            </div>
          </div>

          <Dropdown
            triggerBtn={triggerBtn}
            options={[
              {
                label: "Dodaj użytkownika",
                icon: <Plus className="w-4 h-4" />,
                actionHandler: () => onCreateUserAccountRequest(),
              },
              {
                label: "Zarządzaj rolami",
                icon: <Plus className="w-4 h-4" />,
                actionHandler: () => navigate("/admin/manage-roles"),
              },
            ]}
            position={{ align: "end" }}
          />
        </div>
      </div>

      <div className="flex bg-muted/40 rounded-lg px-3 py-2 gap-3 items-center flex-wrap mb-4">
        {/* --- Keyword Filter ---*/}
        <Input
          placeholder="Szukaj użytkownika..."
          className="w-48"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* --- Role Filter ---- */}
        <Select
          value={selectedRole ?? "all"}
          onValueChange={(value) => setSelectedRole(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtruj rolę" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie role</SelectItem>
            {roles.map((role: any) => {
              const IconComp = role.iconKey ? (iconMap as any)[role.iconKey] : undefined;
              return (
                <SelectItem key={role._id} value={role._id}>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0"
                      style={{
                        background: role.labelColor ? `var(--color-${role.labelColor})` : undefined,
                      }}
                      aria-hidden
                    >
                      {IconComp ? <IconComp className="w-4 h-4 text-white" /> : null}
                    </span>
                    <span className="text-sm">{role.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* --- Status Filter ----*/}
        <Select
          value={selectedStatus ?? "all"}
          onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszyscy</SelectItem>
            <SelectItem value="active">Aktywni</SelectItem>
            <SelectItem value="inactive">Nieaktywni</SelectItem>
          </SelectContent>
        </Select>

        {/* --- Reset Filters Button ----*/}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedRole(null);
            setSelectedStatus(null);
            setSearchTerm("");
          }}
        >
          Resetuj filtry
        </Button>

        <Badge variant="outline" className="ml-auto">
          Znaleziono: {users.length}
        </Badge>
      </div>

      <Card className=" bg-transparent shadow-none pr-4">
        <CardContent className="p-0">
          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader className="animate-spin w-6 h-6 " />
            </div>
          )}

          {isError && (
            <p className="text-destructive text-center mt-10">
              {(error as Error)?.message || "Błąd podczas ładowania użytkowników"}
            </p>
          )}

          {!isLoading && !isError && users.length === 0 && (
            <p className="text-center mt-10">Nie znaleziono użytkowników</p>
          )}

          {!isLoading && !isError && users.length > 0 && (
            <ul className="space-y-4">
              {users.map((user: IUser) => (
                <UserListItemCard
                  key={user._id}
                  onRequestResetPassword={onRequestReset}
                  onRequestAccountStatustoggle={onRequestToggle}
                  user={user}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {pendingAction && (
        <Alert
          isOpen={!!pendingAction}
          isLoading={isResetPasswordLoading || isDisableAccountLoading || isEnableAccountLoading}
          type="warning"
          title={
            pendingAction?.type === "RESET_PASSWORD"
              ? "Resetowanie hasła użytkownika"
              : pendingAction.user.isActive
              ? "Dezaktywacja konta użytkownika"
              : "Aktywacja konta użytkownika"
          }
          onCancel={() => setPendingAction(null)}
          onConfirm={onConfirm}
        >
          {pendingAction?.type === "RESET_PASSWORD" ? (
            <>
              Czy na pewno chcesz zresetować hasło użytkownika&nbsp;
              <strong>
                {pendingAction.user.name} {pendingAction.user.surname}
              </strong>
              ?<br />
              Reset przywróci hasło do domyślnej wartości z konfiguracji i wymusi na użytkowniku ustawienie nowego hasła
              przy następnym logowaniu.
            </>
          ) : (
            <>
              Czy na pewno chcesz {pendingAction.user.isActive ? "zdezaktywować" : "aktywować"} konto użytkownika&nbsp;
              <strong>
                {pendingAction.user.name} {pendingAction.user.surname}
              </strong>
              ?<br />
              {pendingAction.user.isActive
                ? "Użytkownik straci dostęp do systemu."
                : "Dostęp użytkownika do systemu zostanie przywrócony."}
            </>
          )}
        </Alert>
      )}

      <UserAccountModal
        roles={roles}
        isCreatingUserAccount={isCreatingUserAccount}
        setIsCreatingUserAccount={setIsCreatingUserAccount}
      />
    </div>
  );
};
