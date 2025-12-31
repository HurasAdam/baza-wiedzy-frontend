import { Button } from "@/components/ui/button";
import { FileText, FolderKanban, Lock, Plus } from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

export function WorkspaceOverviewPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { folders = [], handleAddFolder, permissions } = useOutletContext<{ folders: any[] }>();

  const handleOpenFolder = (folderId: string) => {
    navigate(`/workspace/${workspaceId}/folders/${folderId}`);
  };

  return (
    <div className="flex flex-col h-full w-full py-8 px-6 lg:px-12 bg-gradient-to-br from-background via-background/90 to-background/60 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Twoje foldery</h1>
          <p className="text-muted-foreground text-sm mt-1">Przeglądaj i zarządzaj folderami w swojej kolekcji.</p>
        </div>
        <Button
          disabled={!permissions.addFolder}
          onClick={handleAddFolder}
          size="sm"
          className="gap-2 shadow-md hover:shadow-lg transition-all"
        >
          {!permissions.addFolder ? <Lock className="w-3 h-3" /> : <Plus className="w-4 h-4" />}
          Nowy folder
        </Button>
      </div>

      {/* Empty state */}
      {folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <FolderKanban className="w-20 h-20 mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium"> Dodaj folder, aby rozpocząć.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Dodaj pierwszy folder i zacznij porządkować swoje materiały.
          </p>
          {permissions.addFolder && (
            <Button onClick={handleAddFolder} className="mt-6 gap-2 shadow-md hover:shadow-lg transition-all">
              <Plus className="w-4 h-4" />
              Dodaj folder
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {folders.map((folder) => (
            <div
              key={folder._id}
              onClick={() => handleOpenFolder(folder._id)}
              className="cursor-pointer group rounded-2xl p-5 border border-border/40 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm 
                         shadow-sm hover:shadow-xl hover:border-primary/40 hover:from-card/80 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <FolderKanban className="w-8 h-8 text-primary/50 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 blur-lg opacity-30 bg-primary/0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(folder.createdAt).toLocaleDateString("pl-PL")}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-muted-foreground truncate mb-2">{folder.name}</h2>

              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <FileText className="w-4 h-4" />
                {folder.articlesCount} {folder.articlesCount === 1 ? "artykuł" : "artykułów"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
