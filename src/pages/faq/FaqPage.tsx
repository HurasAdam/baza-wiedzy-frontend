import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { FaqDescriptionModal } from "../../components/faq-description/faq-description-modal";
import { EditFaqItemModal } from "../../components/faq-item/edit-faq-item-modal";
import { FaqItemModal } from "../../components/faq-item/faq-item-modal";
import { Alert } from "../../components/shared/alert-modal";
import queryClient from "../../config/query.client";
import * as animation from "../../constants/animations";
import { COLOR_TOKEN_MAP, ICONS } from "../../constants/faq-icons";
import { useAuthQuery } from "../../hooks/auth/use-auth";
import { useDeleteFaqItemMutaton } from "../../hooks/faq-item/use-faq-item";
import { useFindFaqQuery, useFindFaqsQuery } from "../../hooks/faq/use-faq";
import type { Faq, FaqItem } from "../../types/faq";
import FaqHeader from "./components/FaqHeader";
import FaqItemsSection from "./components/FaqItemsSection";

export type FaqCategory = {
  _id: string;
  title: string;
  iconKey?: keyof typeof ICONS;
  labelColor?: keyof typeof COLOR_TOKEN_MAP;
  description?: string;
  isDefault?: boolean;
};

export interface DeleteActionData {
  question: string;
  faqItemId: string;
}

export function FaqPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFaqId = searchParams.get("id");
  const [isCreatingFaqItem, setIsCreatingFaqItem] = useState(false);
  const [isEditingFaqItem, setIsEditingFaqItem] = useState(false);
  const [editingFaqItemId, setEditingFaqItemId] = useState<string | null>(null);
  const [pendingDeleteAction, setPendingDeleteAction] = useState<DeleteActionData | null>(null);
  const [isFaqItemDescriptionModalOpen, setIsFaqItemDescriptionModalOpen] = useState(false);
  const [selectedFaqDetailsContent, setSelectedFaqDetailsContent] = useState<Faq | null>(null);

  const { data: user } = useAuthQuery();

  const userPermissions = user?.role?.permissions || [];

  const { data: faqs, isLoading: isFaqsLoading } = useFindFaqsQuery();

  const [open, setOpen] = useState(false);

  const activeFaqId = useMemo<string | null>(() => {
    if (urlFaqId) return urlFaqId;
    if (faqs?.length) {
      const defaultFaq = faqs.find((f) => f.isDefault) || faqs[0];
      return defaultFaq._id;
    }
    return null;
  }, [faqs, urlFaqId]);

  useEffect(() => {
    if (!urlFaqId && activeFaqId) {
      setSearchParams({ id: activeFaqId });
    }
  }, [urlFaqId, activeFaqId, setSearchParams]);

  const { data: faq, isLoading: isFaqLoading } = useFindFaqQuery(activeFaqId || "");

  const { mutate: deleteMutation, isPending: isDeletePending } = useDeleteFaqItemMutaton();
  const activeCategory = faqs?.find((f) => f._id === activeFaqId) as FaqCategory | undefined;

  const handleSelectFaq = (id: string) => {
    setSearchParams({ id });
    setOpen(false);
  };

  const handleShowFaqDescriptionContent = (faq: Faq) => {
    if (!faq) return;
    setSelectedFaqDetailsContent(faq);
    setIsFaqItemDescriptionModalOpen(true);
  };

  const handleCloseFaqItemDescription = (): void => {
    setIsFaqItemDescriptionModalOpen(false);
    setSelectedFaqDetailsContent(null);
  };

  const onCreateFaqItemRequest = (): void => {
    setIsCreatingFaqItem(true);
  };
  const onEditFaqItemRequest = (faqItemId: string): void => {
    setEditingFaqItemId(faqItemId);
    setIsEditingFaqItem(true);
  };

  const onDeleteRequest = (faqItem: FaqItem): void => {
    setPendingDeleteAction({
      question: faqItem.question,
      faqItemId: faqItem._id,
    });
  };

  const OnResetDeleteAction = (): void => {
    setPendingDeleteAction(null);
  };

  const onDeleteConfirm = () => {
    if (!pendingDeleteAction) return;
    deleteMutation(pendingDeleteAction.faqItemId, {
      onSuccess: () => {
        toast.success("Pytanie usunięte", {
          position: "bottom-right",
          description: "Pytanie zostało pomyślnie usunięte i nie jest już widoczne dla użytkowników.",
        });
        queryClient.invalidateQueries({ queryKey: ["faq", activeFaqId] });
        setPendingDeleteAction(null);
      },
    });
  };

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="flex flex-col h-full w-full py-6 px-10 max-w-6xl mx-auto"
    >
      <FaqHeader
        isFaqsLoading={isFaqsLoading}
        isFaqLoading={isFaqLoading}
        open={open}
        setOpen={setOpen}
        faqs={faqs}
        faq={faq}
        activeCategory={activeCategory}
        activeFaqId={activeFaqId}
        handleSelectFaq={handleSelectFaq}
        handleShowFaqDescriptionContent={handleShowFaqDescriptionContent}
        userPermissions={userPermissions}
      />

      <FaqItemsSection
        isFaqLoading={isFaqLoading}
        faq={faq}
        onCreateFaqItemRequest={onCreateFaqItemRequest}
        onEditFaqItemRequest={onEditFaqItemRequest}
        onDeleteRequest={onDeleteRequest}
        userPermissions={userPermissions}
      />

      {selectedFaqDetailsContent && (
        <FaqDescriptionModal
          isFaqItemDescriptionModalOpen={isFaqItemDescriptionModalOpen}
          setIsFaqItemDescriptionModalOpen={setIsFaqItemDescriptionModalOpen}
          descriptionContent={selectedFaqDetailsContent}
          onClose={handleCloseFaqItemDescription}
        />
      )}

      {pendingDeleteAction && (
        <Alert
          isOpen={!!pendingDeleteAction}
          isLoading={isDeletePending}
          type="warning"
          title="Potwierdzenie usunięcia pytania FAQ"
          onConfirm={onDeleteConfirm}
          onCancel={OnResetDeleteAction}
        >
          <>
            Czy na pewno chcesz usunąć pytanie:&nbsp;
            <strong>{pendingDeleteAction.question}</strong>?
            <br />
            <br />
            <em>Operacja ta jest nieodwracalna.</em> Po usunięciu pytanie i jego odpowiedź zostaną trwale usunięte z
            systemu. Upewnij się, że chcesz kontynuować.
          </>
        </Alert>
      )}

      {faqs && (
        <FaqItemModal faqs={faqs} isCreatingFaqItem={isCreatingFaqItem} setIsCreatingFaqItem={setIsCreatingFaqItem} />
      )}

      {editingFaqItemId && faqs && (
        <EditFaqItemModal
          faqs={faqs}
          isEditingFaqItem={isEditingFaqItem}
          faqItemId={editingFaqItemId}
          setIsEditingFaqItem={setIsEditingFaqItem}
        />
      )}
    </motion.div>
  );
}
