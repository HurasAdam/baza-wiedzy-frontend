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
    <CardHeader className="flex justify-between items-center">
      {isFaqLoading ? (
        <CardTitle>Ładowanie ...</CardTitle>
      ) : (
        <CardTitle className="text-header-foreground">Pytania i odpowiedzi({faqItemCount || 0})</CardTitle>
      )}

      {userPermissions.includes("ADD_FAQ_QUESTION") && (
        <Button onClick={onCreateFaqItemRequest} variant="default" size="sm">
          <Plus className="w-4 h-4 mr-1" /> Dodaj pytanie
        </Button>
      )}
    </CardHeader>
  );
};

export default FaqItemsHeader;
