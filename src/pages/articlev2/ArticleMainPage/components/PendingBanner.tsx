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

export const PendingBanner = ({ userPermissions, actions }: Props) => {
  return (
    <div className="mb-6 relative overflow-hidden rounded-xl border border-border bg-background px-6 py-4 shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-muted-foreground/30 via-muted-foreground/10 to-transparent" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-muted/40">
            <AlertCircle className="h-5 w-5 text-orange-600/75" />
          </div>

          <div className="flex flex-col leading-tight space-y-1">
            <p className="text-sm font-semibold text-foreground">Artykuł zweryfikowany ponad 12 miesięcy temu</p>
            <p className="text-xs text-muted-foreground">
              Treść artykułu może nie być aktualna - wpis wymaga ponownej weryfikacji.
            </p>
          </div>
        </div>

        {userPermissions.includes("APPROVE_ARTICLE") && (
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button size="sm" className="h-8 px-3 text-xs font-medium" onClick={actions.APPROVE_ARTICLE}>
              Zweryfikuj ponownie
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
