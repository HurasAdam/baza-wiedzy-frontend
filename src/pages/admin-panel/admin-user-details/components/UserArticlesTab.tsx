// ProductTopicsTab.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Dropdown } from "../../../../components/Dropdown";
import { EditFaqItemModal } from "../../../../components/faq-item/edit-faq-item-modal";
import { Alert } from "../../../../components/shared/alert-modal";
import { TopicModal } from "../../../../components/topic/topic-modal";
import queryClient from "../../../../config/query.client";
import { useDeleteFaqItemMutaton } from "../../../../hooks/faq-item/use-faq-item";
import { useFindFaqsQuery } from "../../../../hooks/faq/use-faq";
import { useFindProductsQuery } from "../../../../hooks/products/use-products";
import type { FaqItem } from "../../../../types/faq";
import type { DeleteActionData } from "../../../faq/FaqPage";

interface ProductTopicsTabProps {
  faqId: string;
  questions: {
    _id: string;
    question: string;
    answer: string;
  }[];
}

export const UserArticlesTab = ({ faqId, questions }: ProductTopicsTabProps) => {
  const [isCreatingTopic, setIsCreatingTopic] = useState<boolean>(false);
  const [isEditingFaqItem, setIsEditingFaqItem] = useState(false);
  const [editingFaqItemId, setEditingFaqItemId] = useState<string | null>(null);
  const [pendingDeleteAction, setPendingDeleteAction] = useState<DeleteActionData | null>(null);

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (faqId) searchParams.append("faq", faqId);

    return searchParams;
  }, [faqId]);

  const { data: products = [] } = useFindProductsQuery();
  const { data: faqs, isLoading } = useFindFaqsQuery(params);
  const { mutate: deleteMutation, isPending: isDeletePending } = useDeleteFaqItemMutaton();

  const onCreateTopic = (): void => {
    setIsCreatingTopic(true);
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
        toast.success("Pytanie zostało usunięte");
        queryClient.invalidateQueries({ queryKey: ["faq", faqId] });

        setPendingDeleteAction(null);
      },
    });
  };

  if (isLoading) return <p>Ładowanie pytań...</p>;

  if (!questions || questions.length === 0)
    return (
      <>
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Pytania i odpowiedzi (0)</CardTitle>
            <Button onClick={onCreateTopic} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Dodaj pytanie
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm text-center py-6">Brak pytań powiązanych z tym FAQ</p>
          </CardContent>
        </Card>
        <TopicModal
          products={products}
          isCreatingTopic={isCreatingTopic}
          setIsCreatingTopic={setIsCreatingTopic}
          productId={faqId}
        />
      </>
    );

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Pytania i odpowiedzi({questions.length})</CardTitle>
          <Button onClick={onCreateTopic} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Dodaj pytanie
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {questions.map((item) => (
              <li key={item._id} className="flex justify-between items-start py-3">
                <div className="flex flex-col gap-1.5 px-1 py-2.5">
                  <p className="text-sm font-medium text-[var(--color-foreground)]">{item.question}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{item.answer}</p>
                </div>
                {/* <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button> */}
                <Dropdown
                  triggerBtn={
                    <Button size="icon" variant="ghost" aria-label="Opcje pytania" className="p-1 rounded ">
                      <MoreHorizontal className="w-5 h-5 hover:text-primary" />
                    </Button>
                  }
                  options={[
                    {
                      label: "Edytuj",
                      icon: <Edit className="w-4 h-4" />,
                      actionHandler: () => {
                        onEditFaqItemRequest(item._id);
                      },
                    },
                    {
                      label: "Usuń",
                      icon: <Trash className="w-4 h-4 text-rose-600/80" />,
                      actionHandler: () => {
                        onDeleteRequest(item);
                      },
                    },
                  ]}
                  position={{ align: "end" }}
                />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <TopicModal
        products={products}
        isCreatingTopic={isCreatingTopic}
        setIsCreatingTopic={setIsCreatingTopic}
        productId={faqId}
      />
      {editingFaqItemId && faqs && (
        <EditFaqItemModal
          faqs={faqs}
          isEditingFaqItem={isEditingFaqItem}
          faqItemId={editingFaqItemId}
          setIsEditingFaqItem={setIsEditingFaqItem}
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
    </>
  );
};
