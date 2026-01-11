/**
 * Banner dla statusu `Draft` z flagą `isVisible: true`.
 * Wyświetlany, gdy artykuł został edytowany poprzez pełną edycję i wymaga ponownej weryfikacji.
 * Zawiera przyciski do zatwierdzenia zmian lub zgłoszenia uwag,
 * jeśli użytkownik posiada uprawnienie `APPROVE_ARTICLE`.
 *
 * @param userPermissions - Lista uprawnień użytkownika.
 * @param actions - Obiekt zawierający funkcje do obsługi akcji:
 *   - `APPROVE_ARTICLE` – zatwierdzenie zmian,
 *   - `REJECT_ARTICLE` – zgłoszenie uwag.
 */

import { Hourglass } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface EditedActions {
  APPROVE_ARTICLE: () => void;
  REJECT_ARTICLE: () => void;
}

interface Props {
  userPermissions: string[];
  actions: EditedActions;
}

export const EditedDraftBanner = ({ userPermissions, actions }: Props) => (
  <div className="mb-6 flex items-center justify-between gap-4 rounded-lg bg-muted/30 px-5 py-3 shadow-sm">
    <div className="flex items-center gap-4">
      {/* Ikona statusu */}
      <div className="flex items-center justify-center w-9 h-9 rounded-md bg-background border shadow-sm">
        <Hourglass className="w-4 h-4 text-yellow-600/85" />
      </div>

      {/* Tekst */}
      <div className="leading-tight">
        <p className="text-sm font-medium text-foreground">Wprowadzono zmiany w artykule</p>
        <p className="text-xs text-muted-foreground">
          Treść artykułu mogła ulec modyfikacji i wymagane ponownej weryfikacji
        </p>
      </div>
    </div>

    {/* Akcje */}

    <div className="flex gap-2">
      {userPermissions.includes("APPROVE_ARTICLE") && (
        <Button onClick={() => actions.APPROVE_ARTICLE()} size="sm">
          Zatwierdź zmiany
        </Button>
      )}
      {userPermissions.includes("REJECT_ARTICLE") && (
        <Button onClick={() => actions.REJECT_ARTICLE()} size="sm" variant="outline">
          Zgłoś uwagi
        </Button>
      )}
    </div>
  </div>
);
