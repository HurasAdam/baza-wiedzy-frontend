import { Check, FlagIcon } from "lucide-react";
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
}

const FlaggedArticlesHeader = ({
  userFlags,
  handleSelectFlag,
  activeFlag,
  activeFlagData,
  openFlags,
  setOpenFlags,
}: FlaggedArticlesHeaderProps) => {
  console.log("AKTYWNE ", activeFlagData);
  return (
    <div className="flex items-center gap-3">
      <Popover open={openFlags} onOpenChange={setOpenFlags}>
        <PopoverTrigger asChild>
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105"
            style={{ backgroundColor: activeFlagData.color }}
          >
            <FlagIcon className="w-7 h-7 text-white" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-64" side="bottom" align="start">
          <Command>
            <CommandList className="max-h-80 overflow-auto scrollbar-custom">
              <CommandEmpty>Brak flag</CommandEmpty>
              <CommandGroup heading="Wybierz flagę">
                {userFlags.map((flag) => {
                  const isActive = flag._id === activeFlag;
                  return (
                    <CommandItem
                      key={flag._id}
                      onSelect={() => handleSelectFlag(flag._id)}
                      className={`cursor-pointer px-3 py-1.5 rounded flex items-center justify-between ${
                        isActive ? "bg-primary text-foreground font-semibold !hover:bg-card" : "text-muted-foreground"
                      }`}
                    >
                      <span>{flag.name}</span>
                      {isActive && (
                        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-primary">
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
      <h1 className="text-xl font-bold flex items-center gap-2">Kolekcja - {activeFlagData.name}</h1>
    </div>
  );
};

export default FlaggedArticlesHeader;
