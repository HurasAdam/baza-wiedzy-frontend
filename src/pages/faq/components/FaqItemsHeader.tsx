// FaqItemsHeader.tsx
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface FaqItemsHeaderProps {
  isFaqLoading: boolean;
  faqItemCount?: number;
  onCreateFaqItemRequest: () => void;
  userPermissions: string[];
}

const FaqItemsHeader = ({
  isFaqLoading,
  faqItemCount,
  onCreateFaqItemRequest,
  userPermissions,
}: FaqItemsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      {isFaqLoading ? (
        <div className="h-6 w-40 bg-muted animate-pulse rounded" />
      ) : (
        <h2 className="text-lg font-semibold">Pytania ({faqItemCount || 0})</h2>
      )}

      {userPermissions.includes("ADD_FAQ_QUESTION") && (
        <Button onClick={onCreateFaqItemRequest} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Dodaj pytanie
        </Button>
      )}
    </div>
  );
};
export default FaqItemsHeader;
