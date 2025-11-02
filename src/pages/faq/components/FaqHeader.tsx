import { HelpCircle, Loader, Plus } from "lucide-react";
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

const FaqHeader = (props: FaqHeaderProps) => {
  const {
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
  } = props;

  const ActiveIcon = ICONS[activeCategory?.iconKey || "HelpCircle"] || HelpCircle;
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {isFaqsLoading ? (
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
  );
};

export default FaqHeader;
