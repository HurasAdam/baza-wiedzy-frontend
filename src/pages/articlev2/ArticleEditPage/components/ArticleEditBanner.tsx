import { Edit3, Loader } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export const ArticleEditBanner = ({ isDirty, isLoading, onCancel, onSave }) => (
  <div
    className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/60
                  bg-sidebar/70 px-5 py-3 shadow-xs backdrop-blur-sm"
  >
    {/* Ikona + Tekst */}
    <div className="flex items-start sm:items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/40">
        <Edit3 className="w-5 h-5 text-primary" />
      </div>
      <div className="flex flex-col gap-1 py-2">
        <span className="text-xs text-muted-foreground">
          Wprowadź zmiany w artykule, zapisz je, a następnie wybierz odpowiedni tryb edycji.
        </span>
        <ul className="text-xs text-muted-foreground list-disc ml-5 mt-1 space-y-0.5">
          <li>
            <strong>Prosta edycja:</strong> modyfikuje treść, nie wpływa na status artykułu
          </li>
          <li>
            <strong>Pełna edycja:</strong> modyfikuje treść i aktualizuje status artykułu
          </li>
        </ul>
        {isDirty && (
          <span className="text-xs text-yellow-600 mt-1">
            Masz niezapisane zmiany - kliknij "Zapisz", aby kontynuować.
          </span>
        )}
      </div>
    </div>

    {/* Przyciski */}
    <div className="flex gap-2 mt-3 sm:mt-0">
      <Button onClick={onCancel} size="sm" variant="outline">
        Anuluj
      </Button>
      <Button onClick={onSave} size="sm" disabled={!isDirty || isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            Zapisuję...
          </div>
        ) : (
          "Zapisz"
        )}
      </Button>
    </div>
  </div>
);
