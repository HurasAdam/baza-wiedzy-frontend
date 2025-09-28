import { Edit, HelpCircle, Loader, MoreHorizontal, Pin, Plus, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Dropdown } from "../../components/Dropdown";
import { FaqDescriptionModal } from "../../components/faq-description/faq-description-modal";
import { EditFaqItemModal } from "../../components/faq-item/edit-faq-item-modal";
import { FaqItemModal } from "../../components/faq-item/faq-item-modal";
import { Alert } from "../../components/shared/alert-modal";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import queryClient from "../../config/query.client";
import { COLOR_TOKEN_MAP, ICONS } from "../../constants/faq-icons";
import { useAuthQuery } from "../../hooks/auth/use-auth";
import { useDeleteFaqItemMutaton } from "../../hooks/faq-item/use-faq-item";
import { useFindFaqQuery, useFindFaqsQuery } from "../../hooks/faq/use-faq";
import type { Faq, FaqItem } from "../../types/faq";

type FaqCategory = {
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
  const navigate = useNavigate();
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

  // --- FAQ Fetch ---
  const { data: faq, isLoading: isFaqLoading } = useFindFaqQuery(activeFaqId || "");

  // --- Delete FAQ Mutation ---
  const { mutate: deleteMutation, isPending: isDeletePending } = useDeleteFaqItemMutaton();
  const activeCategory = faqs?.find((f) => f._id === activeFaqId) as FaqCategory | undefined;
  const ActiveIcon = ICONS[activeCategory?.iconKey || "HelpCircle"] || HelpCircle;

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
        toast.success("Pytanie zostało usunięte");
        queryClient.invalidateQueries({ queryKey: ["faq", activeFaqId] });
        setPendingDeleteAction(null);
      },
    });
  };

  return (
    <section className="mx-auto bg-background h-full ">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {isFaqsLoading && isFaqLoading ? (
            <div className="w-14 h-14 rounded-xl flex bg-primary/90 items-center justify-center text-white shadow-sm cursor-pointer transition-transform hover:scale-105">
              <Loader className="w-7 h-7 animate-spin" />
            </div>
          ) : (
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
                        const Icon = ICONS[item.iconKey];
                        return (
                          <CommandItem
                            key={item._id}
                            onSelect={() => handleSelectFaq(item._id)}
                            className={`cursor-pointer  ${
                              item._id === activeFaqId
                                ? "bg-accent border-l-4  border-primary text-primary-foreground group"
                                : ""
                            }`}
                          >
                            <Icon className="w-4 h-4 mr-2 group-text-foreground" />
                            <span>{item.title}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
          {isFaqLoading ? (
            <div className="flex flex-col gap-2 ">
              <div className="h-4.5 animate-pulse rounded min-w-[120px] lg:min-w-[300px] bg-muted"></div>
              <div className="h-2.5 animate-pulse  rounded min-w-[120px] lg:min-w-[300px] bg-muted"></div>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-bold leading-tight">
                <span className="font-serif">FAQ</span> - {activeCategory?.title}
              </h1>

              {faq && (
                <Button
                  variant="link"
                  onClick={() => {
                    handleShowFaqDescriptionContent(faq);
                  }}
                  className="text-xs h-fit text-muted-foreground p-0"
                >
                  więcej
                </Button>
              )}
            </div>
          )}
        </div>

        {userPermissions.includes("ADD_FAQ") && (
          <Dropdown
            triggerBtn={
              <Button variant="default" className="flex items-center gap-1 cursor-pointer">
                Dodaj <Plus className="w-4 h-4" />
              </Button>
            }
            options={[
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
        )}
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          {isFaqLoading ? (
            <CardTitle> Ładowanie ...</CardTitle>
          ) : (
            <CardTitle className="text-header-foreground">Pytania i odpowiedzi({faq?.items?.length})</CardTitle>
          )}
          {userPermissions.includes("ADD_FAQ_QUESTION") && (
            <Button onClick={onCreateFaqItemRequest} variant="default" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Dodaj pytanie
            </Button>
          )}
        </CardHeader>
        {isFaqLoading ? (
          <CardContent className="mx-auto">
            <Loader className="animate-spin" />
          </CardContent>
        ) : (
          <CardContent>
            <ul className="divide-y divide-border">
              {faq?.items?.map((item) => (
                <li key={item._id} className="flex justify-between items-start py-3">
                  <div className="flex flex-col gap-1.5  py-2.5">
                    <p className="text-base leading-[1.4644] font-medium text-forground- flex items-center gap-2">
                      <Pin className="w-6 h-6 bg-accent/80 rounded-sm p-1 text-primary-foreground" /> {item?.question}
                    </p>
                    <p className="text-[15px] leading-[1.4644]  text-foreground px-8 py-3">{item?.answer}</p>
                  </div>

                  {userPermissions.includes("EDIT_FAQ_QUESTION") ? (
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
                  ) : (
                    <Button
                      disabled={true}
                      size="icon"
                      variant="ghost"
                      aria-label="Opcje pytania"
                      className="p-1 rounded "
                    >
                      <MoreHorizontal className="w-5 h-5 hover:text-primary" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>

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
    </section>
  );
}
