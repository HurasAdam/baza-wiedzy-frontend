import { HelpCircle, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaqItemDescriptionModal } from "../../components/faq-item/faq-item-modal";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { COLOR_TOKEN_MAP, ICONS } from "../../constants/faq-icons"; // <- Dodałem COLOR_TOKEN_MAP
import { useFindFaqQuery, useFindFaqsQuery } from "../../hooks/faq/use-faq";

export function FaqPage() {
  const [isFaqItemDescriptionModalOpen, setIsFaqItemDescriptionModalOpen] =
    useState(false);
  const [
    selectedFaqItemDescriptionContent,
    setSelectedFaqItemDescriptionContent,
  ] = useState("");
  const { data: faqs } = useFindFaqsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const urlFaqId = searchParams.get("id");
  const activeFaqId = useMemo(() => {
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

  const { data: faq } = useFindFaqQuery(activeFaqId || "");
  const activeCategory = faqs?.find((f) => f._id === activeFaqId);
  const ActiveIcon =
    ICONS[activeCategory?.iconKey || "HelpCircle"] || HelpCircle;

  const handleSelectFaq = (id: string) => {
    setSearchParams({ id });
    setOpen(false);
    setShowDescription(false); // reset po zmianie kategorii
  };

  const handleShowFaqItemDescription = (faqItem) => {
    setSelectedFaqItemDescriptionContent(faqItem.description);
    setIsFaqItemDescriptionModalOpen(true);
  };

  const handleCloseFaqItemDescription = () => {
    setIsFaqItemDescriptionModalOpen(false);
    setSelectedFaqItemDescriptionContent("");
  };

  return (
    <section className="mx-auto bg-background h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Ikona kategorii */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-sm cursor-pointer transition hover:scale-105"
                style={{
                  backgroundColor:
                    COLOR_TOKEN_MAP[activeCategory?.labelColor || "blue"] ||
                    "var(--color-primary)",
                }}
              >
                <ActiveIcon className="w-7 h-7" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-64">
              <Command>
                <CommandList>
                  <CommandEmpty>Brak FAQ</CommandEmpty>
                  <CommandGroup heading="Kategorie FAQ">
                    {faqs?.map((item) => {
                      const Icon =
                        ICONS[item.iconKey || "HelpCircle"] || HelpCircle;
                      return (
                        <CommandItem
                          key={item._id}
                          onSelect={() => handleSelectFaq(item._id)}
                          className={`cursor-pointer ${
                            item._id === activeFaqId ? "bg-accent" : ""
                          }`}
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

          {/* Header*/}
          <div>
            <h1 className="text-xl font-bold leading-tight">
              {activeCategory?.title || "FAQ"}
            </h1>

            {activeCategory?.description && !showDescription && (
              <Button
                variant="link"
                onClick={() => handleShowFaqItemDescription(activeCategory)}
                className="text-xs h-fit text-muted-foreground p-0 "
              >
                więcej
              </Button>
            )}

            {showDescription && (
              <p className="text-sm text-muted-foreground mt-1 animate-fadeIn">
                {activeCategory.description}
              </p>
            )}
          </div>
        </div>

        <Link to="/faq-create">
          <Button variant="default" className="gap-2">
            <Plus className="w-4 h-4" />
            Dodaj FAQ
          </Button>
        </Link>
      </div>

      {/* FAQ Items */}
      <div className="mt-4 space-y-4">
        {faq?.items?.map((q, i) => (
          <details
            key={i}
            className="group rounded-lg border p-4 transition hover:shadow-sm"
          >
            <summary className="cursor-pointer font-medium group-hover:text-primary">
              {q.question}
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">{q.answer}</p>
          </details>
        ))}
      </div>
      <FaqItemDescriptionModal
        setIsFaqItemDescriptionModalOpen={setIsFaqItemDescriptionModalOpen}
        isFaqItemDescriptionModalOpen={isFaqItemDescriptionModalOpen}
        content={selectedFaqItemDescriptionContent}
        onClose={handleCloseFaqItemDescription}
      />
    </section>
  );
}
