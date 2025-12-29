/**
 * Banner dla statusu `Draft` (nowy artykuł).
 * Wyświetlany, gdy artykuł jest nowy i wymaga weryfikacji.
 * Zawiera przyciski do zatwierdzenia artykułu lub zgłoszenia uwag,
 * jeśli użytkownik posiada uprawnienie `APPROVE_ARTICLE`.
 *
 * @param userPermissions - Lista uprawnień użytkownika.
 * @param actions - Obiekt zawierający funkcje do obsługi akcji:
 *   - `APPROVE_ARTICLE` – zatwierdzenie artykułu,
 *   - `REJECT_ARTICLE` – zgłoszenie uwag.
 */

import { FileText } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface DraftActions {
  APPROVE_ARTICLE: () => void;
  REJECT_ARTICLE: () => void;
}

interface Props {
  userPermissions: string[];
  actions: DraftActions;
}

export const DraftBanner = ({ userPermissions, actions }: Props) => (
  <div className="mb-6 flex items-center justify-between gap-4 rounded-lg bg-muted/30 px-5 py-3 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-9 h-9 rounded-md bg-background border shadow-sm">
        <FileText className="w-4 h-4 animate-pulse text-cyan-600/85" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-medium text-foreground">Nowy wpis – wymaga weryfikacji</p>
        <p className="text-xs text-muted-foreground">Artykuł oczekuje na weryfikację i zatwierdzenie</p>
      </div>
    </div>
    {userPermissions.includes("APPROVE_ARTICLE") && (
      <div className="flex gap-2">
        <Button onClick={() => actions.APPROVE_ARTICLE()} size="sm">
          Zatwierdź
        </Button>
        <Button onClick={() => actions.REJECT_ARTICLE()} size="sm" variant="outline">
          Zgłoś uwagi
        </Button>
      </div>
    )}
  </div>
);
