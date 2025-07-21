import { XCircleIcon, Loader, RefreshCcw } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

interface RejectedArticleBannerProps {
  rejectionReason?: string;
  isResubmitting: boolean;
  onResubmit: () => void;
}

export const RejectedArticleBanner: React.FC<RejectedArticleBannerProps> = ({
  rejectionReason,
  isResubmitting,
  onResubmit,
}) => {
  return (
    <Card className="mb-6 border bg-destructive/10 border-destructive/30">
      <CardContent className="p-4 sm:p-5 grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6">
        <div className="flex items-center justify-center">
          <XCircleIcon className="w-6 h-6 text-red-700" />
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">
            Artykuł został odrzucony
          </h2>
          <p className="text-sm text-foreground">
            Artykuł został odrzucony przez moderatora. Zapoznaj się z uwagami i wprowadź poprawki przed ponownym zgłoszeniem.
          </p>
          {rejectionReason && (
           <Button
           size="sm"
           className="text-foreground cursor-pointer"
           variant="link"
           >
               Pokaż więcej...
           </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-1 bg-muted hover:bg-primary"
            onClick={onResubmit}
            disabled={isResubmitting}
          >
            {isResubmitting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4" />
            )}
            Poproś o ponowną weryfikację
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
