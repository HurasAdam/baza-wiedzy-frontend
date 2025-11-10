import { Button } from "@/components/ui/button";
import { Folder, Pencil, Plus, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import ManageFoldersHeader from "./components/ManageFoldersHeader";

// Mockowane foldery
const MOCK_FOLDERS = [
  { _id: "1", name: "Folder projektów", articlesCount: 12 },
  { _id: "2", name: "Zadania pilne", articlesCount: 5 },
  { _id: "3", name: "Archiwum 2024", articlesCount: 0 },
  { _id: "4", name: "Marketing", articlesCount: 8 },
  { _id: "5", name: "Design system", articlesCount: 3 },
];

export const WorkspaceManageFoldersPage = () => {
  const { folders } = useOutletContext();

  const handleAddFolder = () => alert("Dodaj folder (mock)");
  const handleEditFolder = (id: string) => alert(`Edytuj folder ${id} (mock)`);
  const handleDeleteFolder = (id: string) => alert(`Usuń folder ${id} (mock)`);

  return (
    <div className="py-2 w-full ">
      <ManageFoldersHeader />
      <Separator className="my-4 " />

      <div className="flex justify-end my-4 max-w-7xl mx-auto">
        <Button variant="default" size="sm" onClick={handleAddFolder} className="flex items-center gap-1">
          <Plus size={16} />
          Dodaj folder
        </Button>
      </div>

      {/* Lista folderów */}
      <div className="space-y-2 max-w-7xl mx-auto">
        {folders.map((folder) => (
          <div
            key={folder._id}
            className="flex items-center justify-between bg-background rounded-md p-3 hover:bg-muted/10 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Folder className="w-5 h-5 text-muted-foreground/70" />
              <span className="font-medium truncate">{folder.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{folder.articlesCount} artykułów</span>
              <Button variant="ghost" size="icon" onClick={() => handleEditFolder(folder._id)} title="Edytuj folder">
                <Pencil size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteFolder(folder._id)} title="Usuń folder">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
