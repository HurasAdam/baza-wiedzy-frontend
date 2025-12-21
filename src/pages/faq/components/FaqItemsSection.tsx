// FaqItemsSection.tsx
import type { Faq, FaqItem } from "../../../types/faq";
import FaqItemsHeader from "./FaqItemsHeader";
import FaqItemsList from "./FaqItemsList";

interface FaqItemsSectionProps {
  isFaqLoading: boolean;
  userPermissions: string[];
  faq: Faq | undefined;
  onCreateFaqItemRequest: () => void;
  onEditFaqItemRequest: (faqItemId: string) => void;
  onDeleteRequest: (faqItem: FaqItem) => void;
}

const FaqItemsSection = ({
  isFaqLoading,
  userPermissions,
  faq,
  onCreateFaqItemRequest,
  onEditFaqItemRequest,
  onDeleteRequest,
}: FaqItemsSectionProps) => {
  return (
    <div className="flex flex-col gap-6">
      <FaqItemsHeader
        isFaqLoading={isFaqLoading}
        faqItemCount={faq?.items?.length}
        onCreateFaqItemRequest={onCreateFaqItemRequest}
        userPermissions={userPermissions}
      />

      <FaqItemsList
        isFaqLoading={isFaqLoading}
        items={faq?.items}
        canEdit={userPermissions.includes("EDIT_FAQ_QUESTION")}
        onEdit={onEditFaqItemRequest}
        onDelete={onDeleteRequest}
      />
    </div>
  );
};

export default FaqItemsSection;
