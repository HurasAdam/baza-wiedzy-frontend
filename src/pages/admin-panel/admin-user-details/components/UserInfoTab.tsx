import { CircleCheckBig, CircleX, EllipsisVertical, KeyRound, UserCog } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dropdown } from "../../../../components/Dropdown";
import { Alert } from "../../../../components/shared/alert-modal";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { UpdateUserRoleModal } from "../../../../components/user-role/update-user-role-modal";
import queryClient from "../../../../config/query.client";
import {
  useDisableUserAccountMutation,
  useEnableUserAccountMutation,
  useResetUserPasswordMutation,
} from "../../../../hooks/users/use-users";
import { formatDate } from "../../../../utils/format-date";
import UserInfoEmailBadge from "./UserInfoEmailBadge";
import UserInfoForm from "./UserInfoForm";
import UserInfoRoleBadge from "./UserInfoRoleBadge";
import UserInfoSection from "./UserInfoSection";

type Role = {
  _id: string;
  name: string;
  iconKey: string;
  labelColor: string;
};

export type UserShape = {
  _id: string;
  name: string;
  surname: string;
  email: string;
  bio?: string | null;
  mustChangePassword: boolean;
  verified: boolean;
  isActive: boolean;
  lastLogin: string;
  role: Role;
  createdAt: string;
  updatedAt?: string | null;
  favourites?: string[];
};

export type ActionType = "RESET_PASSWORD" | "TOGGLE_ACCOUNT" | "CHANGE_ROLE";
export interface PendingAction {
  type: ActionType;
  user: UserShape;
}

export function UserInfoTab({ user }: { user: UserShape; onSave?: (payload: unknown) => Promise<void> | void }) {
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const { mutate: resetUserPasswordMutation, isPending: isResetPasswordLoading } = useResetUserPasswordMutation();
  const { mutate: disableUserAccountMutation, isPending: isDisableAccountLoading } = useDisableUserAccountMutation();
  const { mutate: enableUserAccountMutation, isPending: isEnableAccountLoading } = useEnableUserAccountMutation();

  const onEditUser = () => {
    setIsEditingUser(true);
  };

  const onEditCancel = () => {
    setIsEditingUser(false);
  };

  const onConfirm = () => {
    if (!pendingAction) return;
    const { type, user } = pendingAction;

    if (type === "RESET_PASSWORD") {
      resetUserPasswordMutation(user._id, {
        onSuccess: () => toast.success(`Hasło użytkownika ${user.name} ${user.surname} zostało zresetowane`),
        onError: () => toast.error("Podczas resetowania hasła wystąpił błąd, spróbuj ponownie"),
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["user", user._id] });
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
          queryClient.invalidateQueries({ queryKey: ["user", user._id] });
          setPendingAction(null);
        },
      });
    }
  };

  // --- open reset password alert ---
  const onRequestReset = (user: UserShape) => setPendingAction({ type: "RESET_PASSWORD", user });
  // --- open emable/disable account alert ---
  const onRequestToggle = (user: UserShape) => setPendingAction({ type: "TOGGLE_ACCOUNT", user });
  // -- open change user role modal ---
  const onRequestRoleChange = (user: UserShape) => setPendingAction({ type: "CHANGE_ROLE", user });

  const triggerBtn = (
    <Button variant="ghost" size="icon">
      <EllipsisVertical className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="space-y-7">
      {/* --- Górna sekcja użytkownika --- */}
      <Card className="rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* --- Lewa część ---*/}
        <div className="flex flex-col md:flex-row md:items-center  px-3">
          <UserInfoRoleBadge user={user} />
          <UserInfoEmailBadge email={user.email} />
        </div>

        {/* --- Prawa część ---*/}
        <div className="flex items-center gap-20">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left px-4 py-2">
            <span className="text-xs text-muted-foreground uppercase mb-1">Ostatnie logowanie</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {user.lastLogin ? formatDate(user.lastLogin) : "Brak logowania"}
            </span>
          </div>

          <Dropdown
            triggerBtn={triggerBtn}
            options={[
              {
                label: "Zmień role",
                icon: <UserCog className="w-4 h-4" />,
                actionHandler: () => {
                  onRequestRoleChange(user);
                },
              },
              {
                label: "Zresetuj hasło",
                icon: <KeyRound className="w-4 h-4" />,
                actionHandler: () => {
                  onRequestReset(user);
                },
              },
              {
                label: user.isActive ? "Wyłącz konto" : "Włącz konto",
                icon: user.isActive ? (
                  <CircleX className="w-4 h-4 text-destructive" />
                ) : (
                  <CircleCheckBig className="w-4 h-4 text-green-600" />
                ),
                actionHandler: () => {
                  onRequestToggle(user);
                },
              },
            ]}
            position={{ align: "end" }}
          />
        </div>
      </Card>

      {/* ---Informacje dodatkowe --- */}
      <Card className="rounded-xl  p-6 flex flex-col md:flex-row md:divide-x  gap-4">
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left px-4 py-2">
          <span className="text-xs text-muted-foreground uppercase mb-1">Status konta</span>
          <span className="text-sm text-foreground">
            {user.isActive ? (
              <span className="flex items-center gap-2">
                <span className="block w-4 h-4 bg-green-700/75 border border-green-500/70 rounded-full" />
                Aktywne
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="block w-4 h-4 bg-rose-700/65 border border-rose-600/60 rounded-full" />
                Dezaktywowane
              </span>
            )}
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left px-4 py-2">
          <span className="text-xs text-muted-foreground uppercase mb-1">Wymagana zmiana hasła</span>
          <span className="text-sm text-foreground">{user.mustChangePassword ? "Tak" : "Nie"}</span>
        </div>
      </Card>

      {/* --- Formularz edycji ---- */}
      {isEditingUser ? (
        <UserInfoForm user={user} onEditCancel={onEditCancel} onEditSave={onEditCancel} />
      ) : (
        <UserInfoSection user={user} onEditUser={onEditUser} />
      )}

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
      {pendingAction && pendingAction.type === "CHANGE_ROLE" && (
        <UpdateUserRoleModal
          userData={pendingAction?.user}
          isUpdatingUserRole={pendingAction?.type === "CHANGE_ROLE"}
          setIsUpdatingUserRole={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}
