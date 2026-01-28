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

export const DraftBanner = ({ userPermissions, actions }: Props) => {
  if (!userPermissions.includes("APPROVE_ARTICLE")) return null;

  return (
    <div className="mb-6 relative overflow-hidden rounded-xl border border-border bg-background px-6 py-4 shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-muted-foreground/30 via-muted-foreground/10 to-transparent" />

      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-muted/40">
            <FileText className="h-5 w-5 text-cyan-600/85 animate-pulse" />
          </div>

          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">Nowy artykuł – wymaga weryfikacji</p>
            <p className="text-xs text-muted-foreground max-w-md">
              Artykuł oczekuje na weryfikację i zatwierdzenie. Możesz go zatwierdzić lub zgłosić uwagi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="h-8 px-3 text-xs font-medium" onClick={actions.APPROVE_ARTICLE}>
            Zatwierdź
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 px-3 text-xs font-medium"
            onClick={actions.REJECT_ARTICLE}
          >
            Zgłoś uwagi
          </Button>
        </div>
      </div>
    </div>
  );
};
