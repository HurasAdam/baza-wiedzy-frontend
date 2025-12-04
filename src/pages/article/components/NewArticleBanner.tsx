import { AlertTriangleIcon, CheckCircleIcon, Loader, XCircleIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";

interface NewArticleBannerProps {
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: () => void;
  onReject: () => void;
  userPermissions: string[];
}

export const NewArticleBanner = ({
  isApproving,
  isRejecting,
  onApprove,
  onReject,
  userPermissions,
}: NewArticleBannerProps) => {
  const title = "Artykuł został dodany, ale nie jest jeszcze widoczny";
  const description =
    "Artykuł został dodany i wymaga zatwierdzenia - obecnie nie jest widoczny dla innych użytkowników.";

  return (
    <Card className={cn("mb-6 border shadow-sm rounded-2xl bg-destructive/10 border-destructive/30")}>
      <CardContent className="p-5 flex items-center gap-5">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-destructive/20">
          <AlertTriangleIcon className="w-6 h-6 text-destructive" />
        </div>

        <div className="flex-1 space-y-1">
          <h2 className="text-base font-semibold text-foreground leading-snug">{title}</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
        </div>

        {userPermissions.includes("APPROVE_ARTICLE") && (
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              className={cn(
                "flex items-center gap-1 transition-colors duration-200 bg-destructive/80 hover:bg-destructive/90",
                isRejecting && "opacity-60"
              )}
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
                "flex items-center gap-1 transition-transform duration-150  bg-primary/95",
                isApproving && "opacity-60"
              )}
              onClick={onApprove}
              disabled={isApproving}
            >
              {isApproving ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
              Zatwierdź
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
