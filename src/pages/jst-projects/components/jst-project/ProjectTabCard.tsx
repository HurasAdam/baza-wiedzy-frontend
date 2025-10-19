import { Folder, FolderOpen } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
import type { IJstProject } from "../../../../types";

interface Props {
  name: IJstProject["name"];
  isActive: boolean;
  onClick: () => void;
}

const ProjectTabCard = ({ name, isActive, onClick }: Props) => {
  return (
    <div className="relative inline-flex items-center">
      <Button
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
        onClick={onClick}
        variant="ghost"
        className={cn(
          "group flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xs border-b-2 transition-all duration-300 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          isActive
            ? " text-sidebar-primary border-sidebar-primary  cursor-default hover:bg-transparent hover:text-sidebar-primary"
            : "text-muted-foreground border-transparent hover:text-foreground hover:bg-transparent hover:border-border/40 cursor-pointer"
        )}
      >
        {isActive ? (
          <FolderOpen className="h-4 w-4 text-sidebar-primary transition-transform duration-300 scale-110" />
        ) : (
          <Folder className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:scale-105" />
        )}

        <span
          className={cn(
            "truncate transition-colors duration-200",
            isActive ? "text-sidebar-primary" : "group-hover:text-foreground"
          )}
        >
          {name}
        </span>
      </Button>

      <div
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] rounded-full transition-all duration-300 ease-out",
          isActive ? "bg-sidebar-primary opacity-100 scale-x-100" : "opacity-0 scale-x-50"
        )}
      />
    </div>
  );
};

export default ProjectTabCard;
