import { Edit, HelpCircle, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Dropdown } from "../../components/Dropdown";
import { FaqDescriptionModal } from "../../components/faq-description/faq-description-modal";
import { EditFaqItemModal } from "../../components/faq-item/edit-faq-item-modal";
import { FaqItemModal } from "../../components/faq-item/faq-item-modal";
import { Alert } from "../../components/shared/alert-modal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import queryClient from "../../config/query.client";
import { COLOR_TOKEN_MAP, ICONS } from "../../constants/faq-icons";
import { useDeleteFaqItemMutaton } from "../../hooks/faq-item/use-faq-item";
import { useFindFaqQuery, useFindFaqsQuery } from "../../hooks/faq/use-faq";
import type { FaqItem } from "../../types/faq";

type FaqCategory = {
  _id: string;
  title: string;
  iconKey?: keyof typeof ICONS;
  labelColor?: keyof typeof COLOR_TOKEN_MAP;
  description?: string;
  isDefault?: boolean;
};

interface DeleteActionData {
  question: string;
  faqItemId: string;
}

export function FaqPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFaqId = searchParams.get("id");
  const [isCreatingFaqItem, setIsCreatingFaqItem] = useState(false);
  const [isEditingFaqItem, setIsEditingFaqItem] = useState(false);
  const [editingFaqItemId, setEditingFaqItemId] = useState<string | null>(null);
  const [pendingDeleteAction, setPendingDeleteAction] = useState<DeleteActionData | null>(null);
  const [isFaqItemDescriptionModalOpen, setIsFaqItemDescriptionModalOpen] = useState(false);
  const [selectedFaqItemDescriptionContent, setSelectedFaqItemDescriptionContent] = useState<string>("");

  const { data: faqs } = useFindFaqsQuery();

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

  // --- FAQ Fetch ---
  const { data: faq } = useFindFaqQuery(activeFaqId || "");

  // --- Delete FAQ Mutation ---
  const { mutate: deleteMutation, isPending: isDeletePending } = useDeleteFaqItemMutaton();
  const activeCategory = faqs?.find((f) => f._id === activeFaqId) as FaqCategory | undefined;
  const ActiveIcon = ICONS[activeCategory?.iconKey || "HelpCircle"] || HelpCircle;

  const handleSelectFaq = (id: string) => {
    setSearchParams({ id });
    setOpen(false);
  };

  const handleShowFaqItemDescription = (faqItem: FaqCategory | { description?: string }) => {
    if (!faqItem.description) return;
    setSelectedFaqItemDescriptionContent(faqItem.description);
    setIsFaqItemDescriptionModalOpen(true);
  };

  const handleCloseFaqItemDescription = (): void => {
    setIsFaqItemDescriptionModalOpen(false);
    setSelectedFaqItemDescriptionContent("");
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
        toast.success("Pytanie zostało usunięte");
        queryClient.invalidateQueries({ queryKey: ["faq", activeFaqId] });
        setPendingDeleteAction(null);
      },
    });
  };

  return (
    <section className="mx-auto bg-background h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-sm cursor-pointer transition-transform hover:scale-105"
                style={{
                  backgroundColor: COLOR_TOKEN_MAP[activeCategory?.labelColor || "blue"] || "var(--color-primary)",
                }}
              >
                <ActiveIcon className="w-7 h-7" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-64">
              <Command>
                <CommandList className="scrollbar-custom">
                  <CommandEmpty>Brak FAQ</CommandEmpty>
                  <CommandGroup heading="Wybierz FAQ">
                    {faqs?.map((item) => {
                      const Icon = ICONS[item.iconKey || "HelpCircle"] || HelpCircle;
                      return (
                        <CommandItem
                          key={item._id}
                          onSelect={() => handleSelectFaq(item._id)}
                          className={`cursor-pointer ${item._id === activeFaqId ? "bg-accent" : ""}`}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          <span>{item.title}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div>
            <h1 className="text-xl font-bold leading-tight">
              {" "}
              <span className="font-serif">FAQ</span> - {activeCategory?.title || "FAQ"}
            </h1>

            {activeCategory?.description && (
              <Button
                variant="link"
                onClick={() => {
                  handleShowFaqItemDescription(activeCategory);
                }}
                className="text-xs h-fit text-muted-foreground p-0"
              >
                więcej
              </Button>
            )}
          </div>
        </div>

        <Dropdown
          triggerBtn={
            <Button variant="default" className="flex items-center gap-1 cursor-pointer">
              Dodaj <Plus className="w-4 h-4" />
            </Button>
          }
          options={[
            {
              label: "Dodaj pytanie",
              icon: <Plus className="w-4 h-4" />,
              actionHandler: () => {
                onCreateFaqItemRequest();
              },
            },

            {
              label: "Dodaj FAQ",
              icon: <Plus className="w-4 h-4" />,
              actionHandler: () => {
                navigate("/faq/create");
              },
            },
          ]}
          position={{ align: "end" }}
        />
      </div>

      <Accordion type="single" collapsible className="mt-4 space-y-3 pb pb-6">
        {faq?.items?.map((q: FaqItem, i: number) => (
          <AccordionItem
            key={q._id || i}
            value={`item-${i}`}
            className="rounded-md py-2  border-l-2 border-l-border border-b border-t border-r  bg-card data-[state=open]:border-l-primary pl-4 mb-4 transition-colors duration-300"
          >
            <AccordionTrigger className="px-4 py-3 text-left font-semibold cursor-pointer bg-card rounded-t-lg focus:outline-none ">
              {q.question}
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4 text-sm text-muted-foreground border-t border-border flex justify-between items-start">
              <div className="flex flex-col gap-1.5 max-w-[90%]">
                <span className="text-xs text-muted-foreground font-medium">Odpowiedź :</span>
                <span className="text-base">{q.answer}</span>
              </div>

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
                      onEditFaqItemRequest(q._id);
                    },
                  },
                  {
                    label: "Usuń",
                    icon: <Trash className="w-4 h-4 text-rose-600/80" />,
                    actionHandler: () => {
                      onDeleteRequest(q);
                    },
                  },
                ]}
                position={{ align: "end" }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <FaqDescriptionModal
        isFaqItemDescriptionModalOpen={isFaqItemDescriptionModalOpen}
        setIsFaqItemDescriptionModalOpen={setIsFaqItemDescriptionModalOpen}
        content={selectedFaqItemDescriptionContent}
        onClose={handleCloseFaqItemDescription}
      />

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
    </section>
  );
}
