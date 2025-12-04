import { CheckCircleIcon, CircleQuestionMark, Loader, XCircleIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";

interface ArticleDraftVisibleBannerProps {
  status: "draft" | "pending";
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: () => void;
  onReject: () => void;
  userPermissions: string[];
}

export const ArticleDraftVisibleBanner: React.FC<ArticleDraftVisibleBannerProps> = ({
  status,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
  userPermissions,
}) => {
  const title = "Treść artykułu uległa zmianie i wymaga weryfikacji";
  const description = "Treść artykułu została zmieniona i może wymagać sprawdzenia merytorycznego.";

  return (
    <Card className={cn("mb-6 border shadow-sm rounded-2xl bg-destructive/10 border-destructive/30")}>
      <CardContent className="p-5 flex items-center gap-5">
        {/* Ikona */}
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-destructive/10">
          <CircleQuestionMark className="w-6 h-6 text-destructive" />
        </div>

        {/* Treść */}
        <div className="flex-1 space-y-1">
          <h2 className="text-base font-semibold text-foreground leading-snug">{title}</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
        </div>

        {/* Przyciski akcji */}
        {userPermissions.includes("APPROVE_ARTICLE") && (
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="destructive"
              className={cn("flex items-center gap-1 transition-colors duration-200", isRejecting && "opacity-60")}
              onClick={onReject}
              disabled={isRejecting}
            >
              {isRejecting ? <Loader className="w-4 h-4 animate-spin" /> : <XCircleIcon className="w-4 h-4" />}
              Zgłoś sugestie
            </Button>
            <Button
              size="sm"
              variant="default"
              className={cn(
                "flex items-center gap-1 transition-transform duration-150 hover:translate-y-0.5 hover:bg-primary/20",
                isApproving && "opacity-60"
              )}
              onClick={onApprove}
              disabled={isApproving}
            >
              {isApproving ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
              Zweryfikuj
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
