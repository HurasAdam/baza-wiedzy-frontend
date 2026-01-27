import { Loader, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface Props {
  isDirty: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export const Banner = ({ isDirty, isLoading, onCancel, onSave }: Props) => (
  <div className="mb-6 flex items-center justify-between gap-4 rounded-lg bg-muted/30 px-5 py-3 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-background border shadow-sm">
        <Plus className="w-4 h-4 text-primary/80" />
      </div>
      <div className="leading-tight">
        <ul className="text-xs text-muted-foreground list-disc ml-5 space-y-1">
          <li>
            Wprowadź dane artykułu, uzupełniając wymagane pola formularza oznaczone{" "}
            <span className="text-primary font-semibold ml-1 ">*</span>
          </li>
          <li>Zapisz zmiany, aby dodać artykuł.</li>
          <li>
            Po dodaniu artykuł zostanie zapisany jako szkic i będzie wymagał zatwierdzenia, zanim będzie widoczny w
            wyszukiwarce.
          </li>
        </ul>
      </div>
    </div>

    <div className="flex gap-2">
      <Button onClick={onCancel} size="sm" variant="outline">
        Anuluj
      </Button>
      <Button onClick={onSave} size="sm" disabled={isLoading || !isDirty}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader className="animate-spin w-4 h-4" />
            Zapisuję...
          </div>
        ) : (
          "Zapisz"
        )}
      </Button>
    </div>
  </div>
);
