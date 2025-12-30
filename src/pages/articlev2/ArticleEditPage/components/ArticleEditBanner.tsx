import { Edit3, Loader } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export const ArticleEditBanner = ({ isDirty, isLoading, onCancel, onSave }) => (
  <div className="mb-6 flex items-center justify-between gap-4 rounded-lg bg-muted/30 px-5 py-3 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-9 h-9 rounded-md bg-background border shadow-sm">
        <Edit3 className="w-4 h-4 text-primary/80" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-medium text-foreground">Tryb edycji artykułu</p>
        <p className="text-xs text-muted-foreground">
          Wprowadzasz zmiany w artykule. Po kliknięciu „Zapisz” wybierz odpowiedni tryb edycji:
        </p>
        <ul className="text-xs text-muted-foreground list-disc ml-5 mt-1 space-y-1">
          <li>
            <strong>Prosta edycja:</strong> modyfikuje treść nie wpływając na status artykułu
          </li>
          <li>
            <strong>Pełna edycja:</strong> modyfikuje treść i aktualizuje status artykułu
          </li>
        </ul>
        {isDirty && (
          <p className="text-xs text-yellow-600 mt-1">
            Masz niezapisane zmiany – kliknij „Zapisz”, aby kontynuować i wybrać tryb edycji.
          </p>
        )}
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
