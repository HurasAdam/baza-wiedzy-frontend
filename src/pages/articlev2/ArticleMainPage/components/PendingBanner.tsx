/**
 * Banner dla statusu `Pending`.
 * Wyświetlany, gdy artykuł był zweryfikowany ponad 12 miesięcy temu.
 * Zawiera przycisk do ponownej weryfikacji, jeśli użytkownik ma odpowiednie uprawnienia.
 *
 * @param userPermissions - Lista uprawnień roli nadanej użytkownikowi aplikacji.
 * @param actions - Obiekt zawierający funkcje akcji
 */

import { AlertCircle } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface PendingActions {
  APPROVE_ARTICLE: () => void;
}

interface Props {
  userPermissions: string[];
  actions: PendingActions;
}

export const PendingBanner = ({ userPermissions, actions }: Props) => (
  <div className="mb-6 flex items-center justify-between gap-4 rounded-lg bg-muted/30 px-5 py-3 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-9 h-9 rounded-md bg-background border shadow-sm">
        <AlertCircle className="w-4 h-4 text-orange-600/75" />
      </div>

      <div className="leading-tight">
        <p className="text-sm font-medium text-foreground">Artykuł zweryfikowany ponad 12 miesięcy temu</p>
        <p className="text-xs text-muted-foreground">Treść może być nieaktualna i wymaga ponownej weryfikacji.</p>
      </div>
    </div>

    {userPermissions.includes("APPROVE_ARTICLE") && (
      <div className="flex gap-2">
        <Button onClick={() => actions.APPROVE_ARTICLE()} size="sm">
          Zweryfikuj ponownie
        </Button>
      </div>
    )}
  </div>
);
