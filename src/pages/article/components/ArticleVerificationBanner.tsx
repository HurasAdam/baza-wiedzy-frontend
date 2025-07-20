import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  Loader,
  XCircleIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";

interface ArticleVerificationBannerProps {
  status: "draft" | "pending";
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export const ArticleVerificationBanner: React.FC<
  ArticleVerificationBannerProps
> = ({ status, isApproving, isRejecting, onApprove, onReject }) => {
  const isDraft = status === "draft";

  const title = isDraft
    ? "Nowy artykuł oczekuje na zatwierdzenie"
    : "Artykuł wymaga ponownej weryfikacji";

  const description = isDraft
    ? "Ten artykuł został dodany i wymaga zatwierdzenia. Obecnie nie jest widoczny dla innych użytkowników"
    : "Ten artykuł wymaga ponownej weryfikacji – jego treść mogła ulec zmianie lub utracić aktualność.";

  const icon = isDraft ? (
    <ClockIcon className="w-6 h-6 text-rose-800" />
  ) : (
    <AlertTriangleIcon className="w-6 h-6 text-amber-700/90" />
  );

  const bannerColor = isDraft
    ? "bg-destructive/10 border-destructive/30"
    : "bg-yellow-600/10 border-yellow-600/25"; // stonowany żółty
  const textColor = isDraft ? "text-foreground" : "text-foreground";

  return (
    <Card className={cn("mb-6 border shadow-sm", bannerColor)}>
      <CardContent className="p-4 sm:p-5 grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6">
        <div className="flex items-center justify-center">{icon}</div>

        <div className="space-y-1">
          <h2 className={cn("text-base font-semibold", textColor)}>{title}</h2>
          <p className={cn("text-sm", textColor)}>{description}</p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "flex items-center gap-1 bg-muted ",
              isRejecting && "opacity-60"
            )}
            onClick={onReject}
            disabled={isRejecting}
          >
            {isRejecting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <XCircleIcon className="w-4 h-4" />
            )}
            Odrzuć
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "flex items-center gap-1 bg-muted hover:bg-primary ",
              isApproving && "opacity-60"
            )}
            onClick={onApprove}
            disabled={isApproving}
          >
            {isApproving ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircleIcon className="w-4 h-4" />
            )}
            {isDraft ? "Zatwierdź" : "Zweryfikuj"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
