// FaqItemsHeader.tsx
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { CardHeader, CardTitle } from "../../../components/ui/card";

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
    <CardHeader className="flex justify-between items-center bg-card/70 p-4 rounded-xl shadow-sm">
      {isFaqLoading ? (
        <CardTitle className="text-muted-foreground">Ładowanie...</CardTitle>
      ) : (
        <CardTitle className="text-lg font-semibold text-foreground">
          Pytania i odpowiedzi ({faqItemCount || 0})
        </CardTitle>
      )}

      {userPermissions.includes("ADD_FAQ_QUESTION") && (
        <Button
          onClick={onCreateFaqItemRequest}
          variant="default"
          size="sm"
          className="gap-1 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Dodaj pytanie
        </Button>
      )}
    </CardHeader>
  );
};

export default FaqItemsHeader;
