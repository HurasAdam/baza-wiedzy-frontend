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
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <button
            className="text-muted-foreground hover:text-primary transition-colors"
            onClick={() => navigate(`/workspace/${workspaceId}/manage-folders`)}
            title="Zarządzaj folderami"
          >
            <Folders className="w-4 h-4" />
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
          <div
            className="h-6 w-6 flex items-center justify-center text-muted-foreground cursor-not-allowed"
            title="Brak uprawnień"
          >
            <Lock className="w-3.5 h-3.5 opacity-50" />
          </div>
        )}
      </div>

      {/* LISTA */}
      {isLoading ? (
        <SkeletonFoldersList />
      ) : (
        <nav className="flex-1 px-2 pb-3 space-y-1 overflow-y-auto">
          {folders?.map((folder) => (
            <NavLink
              key={folder._id}
              to={`/workspace/${workspaceId}/folders/${folder._id}`}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm transition-all",
                  isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-card-foreground/85 hover:bg-muted hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    {isActive ? <FolderOpen size={18} className="text-primary" /> : <Folder size={18} />}

                    <span className="truncate">{folder.name}</span>
                  </div>

                  {folder.articlesCount > 0 && (
                    <span className="text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {folder.articlesCount}
                    </span>
                  )}
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
    <ul className="px-2 space-y-1 mt-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 px-3 py-2 rounded-md">
          <div className="w-[18px] h-[18px] rounded bg-muted animate-pulse" />
          <div className="h-[14px] w-full rounded bg-muted animate-pulse" />
        </li>
      ))}
    </ul>
  );
};
