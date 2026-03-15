import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Folder, FolderOpen, Lock, Plus } from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

interface Folder {
  _id: string;
  name: string;
  articlesCount?: number;
}

interface WorkspaceFoldersSidebarProps {
  folders: Folder[];
  isLoading: boolean;
  permissions?: Record<string, boolean>;
  onAddFolder: () => void;
}

export const WorkspaceFolderListSidebar = ({
  folders,
  isLoading,
  permissions,
  onAddFolder,
}: WorkspaceFoldersSidebarProps) => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  return (
    <aside className="w-60 border-r border-border/60 bg-card/60 backdrop-blur-sm flex flex-col ">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Foldery</h3>

        {permissions?.addFolder ? (
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-primary"
            onClick={onAddFolder}
          >
            <Plus size={16} />
          </Button>
        ) : (
          <Lock className="w-4 h-4 text-muted-foreground opacity-60" />
        )}
      </div>

      {/* LIST */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {folders.map((folder) => (
          <NavLink
            key={folder._id}
            to={`/workspace/${workspaceId}/folders/${folder._id}`}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* LEFT ACTIVE INDICATOR */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-primary" />
                )}

                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-md transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {isActive ? <FolderOpen size={14} /> : <Folder size={14} />}
                  </div>

                  <span className="truncate">{folder.name}</span>
                </div>

                {folder.articlesCount && folder.articlesCount > 0 && (
                  <span className="text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                    {folder.articlesCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
