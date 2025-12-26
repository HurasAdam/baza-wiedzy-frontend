import { CircleX, FolderKanban, Plus, SearchX } from "lucide-react";
import { Button } from "../../../components/ui/button";
import FolderListSkeleton from "./FolderListSkeleton";
import FolderListView from "./FolderListView";
import type { Folder } from "./ManageFoldersFilters";

interface ManageFoldersListSectionProps {
  handleAddFolder: () => void;
  query: string;
  folders: Folder[];
  view: "grid" | "list";
  openEdit: (folder: Folder) => void;
  openDelete: (folder: Folder) => void;
  isLoading: boolean;
  resetFilters: () => void;
  permissions: Record<string, boolean>;
}

const ManageFoldersListSection = ({
  handleAddFolder,
  query,
  folders,
  view,
  openEdit,
  openDelete,
  isLoading,
  resetFilters,
  permissions,
}: ManageFoldersListSectionProps) => {
  if (isLoading) {
    return <FolderListSkeleton view={view} />;
  }

  if (!isLoading && query.trim() === "" && folders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <FolderKanban className="w-20 h-20 mb-4 text-muted-foreground/50" />
        <p className="text-lg font-medium">Brak folderów w tej kolekcji</p>
        <p className="text-sm text-muted-foreground mt-1">
          Utwórz nowy folder, aby rozpocząć organizację swoich zasobów.
        </p>
        {permissions.addFolder && (
          <Button onClick={handleAddFolder} className="mt-6 gap-2 shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            Dodaj folder
          </Button>
        )}
      </div>
    );
  }

  if (!isLoading && folders.length === 0 && query.trim() !== "") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <SearchX className="w-20 h-20 mb-4 text-muted-foreground/50" />
        <p className="text-lg font-medium">Brak wyników</p>
        <p className="text-sm text-muted-foreground mt-1">
          {`Nie znaleziono folderów pasujących do wyszukiwania "${query}"`}
        </p>
        <Button onClick={resetFilters} className="mt-6 gap-2 shadow-md hover:shadow-lg transition-all">
          <CircleX className="w-4 h-4" />
          Wyczyść filtry
        </Button>
      </div>
    );
  }

  return (
    <FolderListView
      view={view}
      folders={folders}
      openEdit={openEdit}
      openDelete={openDelete}
      permissions={permissions}
    />
  );
};

export default ManageFoldersListSection;
