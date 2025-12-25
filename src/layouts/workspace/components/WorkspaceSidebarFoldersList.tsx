import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Folder, FolderOpen, Folders, Lock } from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

interface Folder {
  _id: string;
  name: string;
  articlesCount?: number;
}

interface WorkspaceFoldersListProps {
  isLoading: boolean;
  folders: Folder[];
  onAddFolder: () => void;
  permissions: Record<string, boolean>;
}

export const WorkspaceSidebarFoldersList = ({
  isLoading,
  folders,
  onAddFolder,
  permissions,
}: WorkspaceFoldersListProps) => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center justify-between px-3.5 pt-3 pb-2 bg-muted/30">
        <h3 className="text-xs font-medium text-muted-foreground/75 uppercase tracking-wide flex items-center gap-2">
          <button
            className="p-0 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => navigate(`/workspace/${workspaceId}/folders`)}
            title="Zarządzaj folderami"
          >
            <Folders className="w-3.5 h-3.5" />
          </button>
          Foldery
        </h3>

        {permissions?.addFolder ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-primary"
            onClick={onAddFolder}
            title="Dodaj folder"
          >
            +
          </Button>
        ) : (
          // jeśli brak permisji, pokazujemy kłódkę zamiast przycisku
          <div
            className="h-6 w-6 flex items-center justify-center text-muted-foreground cursor-not-allowed"
            title="Brak uprawnień do dodawania folderów"
          >
            <Lock className="w-3.5 h-3.5 text-foreground/40" />
          </div>
        )}
      </div>

      {isLoading ? (
        <SkeletonFoldersList />
      ) : (
        <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto scrollbar-custom">
          {folders?.map((folder) => (
            <NavLink
              key={folder._id}
              to={`/workspace/${workspaceId}/folders/${folder._id}`}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive ? "bg-primary/10 text-primary/80 font-medium" : "text-muted-foreground hover:bg-muted"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex-shrink-0">
                    {isActive ? (
                      <FolderOpen size={18} className="text-primary/90" />
                    ) : (
                      <Folder size={18} className="text-muted-foreground" />
                    )}
                    {folder.articlesCount > 0 && (
                      <span className="absolute -top-1 -right-1.5 flex items-center justify-center w-3.5 h-3.5 text-[9px] font-medium text-white bg-accent rounded-full shadow-sm">
                        {folder.articlesCount}
                      </span>
                    )}
                  </div>
                  <span className="truncate">{folder.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
};

const SkeletonFoldersList = () => {
  return (
    <ul className="space-y-1 mt-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 px-5 py-3 rounded-md text-sm bg-transparent">
          <div className="w-[18px] h-[18px] rounded-sm bg-muted-foreground/20 animate-pulse flex-shrink-0" />

          <div className="h-[18px] w-full rounded bg-muted-foreground/20 animate-pulse" />
        </li>
      ))}
    </ul>
  );
};
