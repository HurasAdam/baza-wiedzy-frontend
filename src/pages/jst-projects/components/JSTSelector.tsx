import { Check, ChevronDown, Loader } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";

interface Props {
  projects: { _id: string; name: string }[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
}

export const JSTSelector = ({ projects, activeProjectId, onSelectProject, open, setOpen, isLoading = true }: Props) => {
  const activeProject = projects.find((p) => p._id === activeProjectId);

  return (
    <div className="flex items-center gap-4 mb-4">
      {isLoading ? (
        <>
          <div className="w-10 h-10 rounded-lg flex bg-primary/10 items-center justify-center shadow-sm">
            <Loader className="w-5 h-5 animate-spin text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-muted-foreground">Ładowanie projektów…</h1>
        </>
      ) : (
        <div className="flex gap-2 items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-muted hover:bg-accent transition shadow-sm
                  border border-border active:scale-[0.98] w-56
                "
              >
                <span className="font-medium truncate flex-1 text-left">
                  {activeProject?.name || "Wybierz projekt"}
                </span>
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>
            </PopoverTrigger>

            <PopoverContent className="p-0 w-64" align="start">
              <Command>
                <CommandList className="max-h-80 overflow-auto scrollbar-custom">
                  <CommandEmpty>Brak projektów</CommandEmpty>

                  <CommandGroup heading="Projekty">
                    {projects.map((project) => {
                      const isActive = project._id === activeProjectId;

                      return (
                        <CommandItem
                          key={project._id}
                          onSelect={() => {
                            onSelectProject(project._id);
                            setOpen(false);
                          }}
                          className={`
                            cursor-pointer px-3 py-2 rounded
                            flex items-center justify-between
                            ${isActive ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"}
                          `}
                        >
                          <span>{project.name}</span>

                          {isActive && <Check className="w-4 h-4" />}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};
