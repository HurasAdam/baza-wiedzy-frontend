import { Alert } from "../../../../components/shared/alert-modal";
import type { PendingAction } from "../admin-users";

interface UserActionDialogProps {
  pendingAction: PendingAction | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UserActionDialog = ({ pendingAction, isLoading, onConfirm, onCancel }: UserActionDialogProps) => {
  if (!pendingAction) return null;

  const { user, type } = pendingAction;
  const title =
    type === "RESET_PASSWORD"
      ? "Resetowanie hasła użytkownika"
      : user.isActive
      ? "Dezaktywacja konta użytkownika"
      : "Aktywacja konta użytkownika";

  return (
    <Alert isOpen isLoading={isLoading} type="warning" title={title} onCancel={onCancel} onConfirm={onConfirm}>
      {type === "RESET_PASSWORD" ? (
        <>
          Czy na pewno chcesz zresetować hasło użytkownika{" "}
          <strong>
            {user.name} {user.surname}
          </strong>
          ?
          <br />
          Reset przywróci hasło do domyślnej wartości i wymusi ustawienie nowego przy kolejnym logowaniu.
        </>
      ) : (
        <>
          Czy na pewno chcesz {user.isActive ? "zdezaktywować" : "aktywować"} konto użytkownika{" "}
          <strong>
            {user.name} {user.surname}
          </strong>
          ?
          <br />
          {user.isActive ? "Użytkownik straci dostęp do systemu." : "Dostęp użytkownika zostanie przywrócony."}
        </>
      )}
    </Alert>
  );
};
