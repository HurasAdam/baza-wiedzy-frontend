import { Check, ChevronDown, FlagIcon, Loader } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import type { Flag } from "./FlaggedArticlesListSection";

interface FlaggedArticlesHeaderProps {
  userFlags: Flag[];
  handleSelectFlag: (flagId: string) => void;
  activeFlag: string;
  activeFlagData: Flag;
  openFlags: boolean;
  setOpenFlags: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
}

const FlaggedArticlesHeader = ({
  userFlags,
  handleSelectFlag,
  activeFlag,
  activeFlagData,
  openFlags,
  setOpenFlags,
  isLoading = true,
}: FlaggedArticlesHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      {isLoading ? (
        <>
          <div className="w-10 h-10 rounded-lg flex bg-primary/10 items-center justify-center text-white shadow-sm">
            <Loader className="w-5 h-5 animate-spin text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-muted-foreground">Ładowanie...</h1>
        </>
      ) : (
        <>
          <Popover open={openFlags} onOpenChange={setOpenFlags}>
            <PopoverTrigger asChild>
              <button
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer
                  bg-muted hover:bg-accent transition shadow-sm border border-border
                  active:scale-[0.98] w-48
                "
              >
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: activeFlagData.color }}
                >
                  <FlagIcon className="w-3.5 h-3.5 text-white" />
                </div>

                <span
                  className="
                    font-medium text-left flex-1
                    truncate overflow-hidden text-ellipsis whitespace-nowrap
                  "
                >
                  {activeFlagData.name}
                </span>

                <ChevronDown className="w-4 h-4 opacity-60 flex-shrink-0" />
              </button>
            </PopoverTrigger>

            <PopoverContent className="p-0 w-64" side="bottom" align="start">
              <Command>
                <CommandList className="max-h-80 overflow-auto scrollbar-custom">
                  <CommandEmpty>Brak etykiet</CommandEmpty>

                  <CommandGroup heading="Wybierz etykietę">
                    {userFlags.map((flag) => {
                      const isActive = flag._id === activeFlag;

                      return (
                        <CommandItem
                          key={flag._id}
                          onSelect={() => handleSelectFlag(flag._id)}
                          className={`
                            cursor-pointer px-3 py-1.5 rounded flex items-center justify-between
                            transition
                            ${isActive ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"}
                          `}
                        >
                          <span>{flag.name}</span>

                          {isActive && (
                            <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* --- Title --- */}
          <h1 className="text-xl font-semibold flex items-center gap-2">
            Moje ulubione — <span className="text-muted-foreground">{activeFlagData.name}</span>
          </h1>
        </>
      )}
    </div>
  );
};

export default FlaggedArticlesHeader;
