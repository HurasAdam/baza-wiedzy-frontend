import { Loader, Save, Wand2 } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface Props {
  canSave: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export const Banner = ({ canSave, isLoading, onCancel, onSave }: Props) => (
  <div className="mb-6 flex items-center justify-between gap-4 rounded-lg bg-muted/30 px-5 py-3 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-background border shadow-sm">
        <Wand2 className="w-4 h-4 text-primary/80" />
      </div>

      <div className="leading-tight">
        <ul className="text-xs text-muted-foreground list-disc ml-5 space-y-1">
          <li>
            Skonfiguruj sekcję FAQ, uzupełniając wszystkie pola oznaczone
            <span className="text-primary font-semibold ml-1">*</span>
          </li>
          <li>Aby dodać sekcję FAQ, wymagane jest dodanie co najmniej jednego pytania wraz z odpowiedzią.</li>
          <li>
            Po utworzeniu sekcji FAQ będzie możliwe dodawanie nowych pytań i odpowiedzi oraz zarządzanie istniejącymi w
            ramach wybranej sekcji.
          </li>
        </ul>
      </div>
    </div>

    <div className="flex gap-2">
      <Button onClick={onCancel} size="sm" variant="outline">
        Anuluj
      </Button>
      <Button onClick={onSave} size="sm" disabled={isLoading || !canSave}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader className="animate-spin w-4 h-4" />
            Zapisz
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Zapisz
          </div>
        )}
      </Button>
    </div>
  </div>
);
