import { ArchiveRestore } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";

interface ArchivedActions {
  RESTORE_ARTICLE: () => void;
}

interface Props {
  userPermissions: string[];
  actions: ArchivedActions;
}

export const ArchivedBanner = ({ userPermissions, actions }: Props) => {
  if (!userPermissions.includes("EDIT_ARTICLE")) return null;

  return (
    <div className="mb-6 relative overflow-hidden rounded-xl border border-border bg-background px-6 py-4 shadow-sm">
      {/* subtle accent */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-muted-foreground/30 via-muted-foreground/10 to-transparent" />

      <div className="flex items-center justify-between gap-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-muted/40">
            <ArchiveRestore className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">Artykuł znajduje się w archiwum</p>
            <p className="text-xs text-muted-foreground max-w-md">
              Ten artykuł został wycofany z publikacji i nie jest widoczny w wyszukiwarce dla użytkowników końcowych.
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 px-3 text-xs font-medium"
            onClick={actions.RESTORE_ARTICLE}
          >
            Przywróć z archiwum
          </Button>
        </div>
      </div>
    </div>
  );
};
