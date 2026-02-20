import { ChevronDown, HelpCircle, Loader, Plus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../../../components/Dropdown";
import { Button } from "../../../components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { COLOR_TOKEN_MAP, ICONS } from "../../../constants/faq-icons";
import type { Faq } from "../../../types/faq";
import type { FaqCategory } from "../FaqPage";

interface FaqHeaderProps {
  isFaqsLoading: boolean;
  isFaqLoading: boolean;
  activeCategory: FaqCategory | undefined;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  faq: Faq | undefined;
  faqs: Faq[] | undefined;
  activeFaqId: string | null;
  handleSelectFaq: (faqId: string) => void;
  handleShowFaqDescriptionContent: (faq: Faq) => void;
  userPermissions: string[];
}

const FaqHeader = ({
  isFaqsLoading,
  isFaqLoading,
  activeCategory,
  open,
  setOpen,
  faqs,
  faq,
  activeFaqId,
  handleSelectFaq,
  handleShowFaqDescriptionContent,
  userPermissions,
}: FaqHeaderProps) => {
  const navigate = useNavigate();

  const activeIconKey = activeCategory?.iconKey as keyof typeof ICONS | undefined;
  const ActiveIcon = (activeIconKey && ICONS[activeIconKey]) ?? HelpCircle;

  const labelColorKey = activeCategory?.labelColor as keyof typeof COLOR_TOKEN_MAP | undefined;
  const backgroundColor = (labelColorKey && COLOR_TOKEN_MAP[labelColorKey]) ?? "var(--color-primary)";

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-4">
        {isFaqsLoading ? (
          <div className="w-13.5 h-13.5 rounded-xl flex bg-primary/90 items-center justify-center text-white shadow-lg cursor-not-allowed">
            <Loader className="w-7 h-7 animate-spin" />
          </div>
        ) : (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div
                style={{ backgroundColor }}
                className="w-13.5 h-13.5 rounded-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 relative group bg-muted border"
              >
                <ActiveIcon className="w-7 h-7" />

                <ChevronDown className="w-4 h-4 absolute bottom-1 right-1 text-white opacity-80 transition-transform group-data-[state=open]:rotate-180" />
              </div>
            </PopoverTrigger>

            <PopoverContent className="p-0 w-72 shadow-2xl rounded-xl">
              <Command>
                <CommandList className="scrollbar-custom max-h-64 overflow-y-auto">
                  <CommandEmpty>Brak FAQ</CommandEmpty>
                  <CommandGroup heading="Wybierz FAQ">
                    {faqs?.map((item) => {
                      const iconKey = item.iconKey as keyof typeof ICONS | undefined;
                      const Icon = (iconKey && ICONS[iconKey]) ?? HelpCircle;

                      return (
                        <CommandItem
                          key={item._id}
                          onSelect={() => {
                            handleSelectFaq(item._id);
                            setOpen(false);
                          }}
                          className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md ${
                            item._id === activeFaqId
                              ? "bg-accent border-l-4 border-primary text-primary-foreground"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
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

        <div className="flex flex-col max-w-xl">
          {isFaqLoading ? (
            <div className="flex flex-col gap-2">
              <div className="h-5 animate-pulse rounded bg-muted w-48"></div>
              <div className="h-3 animate-pulse rounded bg-muted w-64"></div>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold">
                <span className="font-serif">FAQ</span> - {activeCategory?.title || "Wybierz kategorię"}
              </h1>

              {faq?.description && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-500 text-sm line-clamp-2 overflow-hidden">{faq.description}</p>

                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs p-0"
                    onClick={() => handleShowFaqDescriptionContent(faq)}
                  >
                    więcej
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {userPermissions.includes("ADD_FAQ") && (
        <Dropdown
          triggerBtn={
            <Button variant="default" size="sm" className="flex gap-2 items-center">
              <Plus className="w-4 h-4" /> Dodaj
            </Button>
          }
          options={[
            {
              label: "Dodaj FAQ",
              icon: <Plus className="w-4 h-4" />,
              actionHandler: () => navigate("/faq/create"),
            },
          ]}
          position={{ align: "end" }}
        />
      )}
    </div>
  );
};

export default FaqHeader;
