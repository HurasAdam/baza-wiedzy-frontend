import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, FolderKanban, Lock, Plus } from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import * as animation from "../../constants/animations";

export function WorkspaceOverviewPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { folders = [], handleAddFolder, permissions } = useOutletContext<{ folders: any[] }>();

  const handleOpenFolder = (folderId: string) => {
    navigate(`/workspace/${workspaceId}/folders/${folderId}`);
  };

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="flex flex-col h-full w-full px-10 md:px-0 py-8 max-w-6xl mx-auto"
    >
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {folders.map((folder) => (
            <div
              key={folder._id}
              onClick={() => handleOpenFolder(folder._id)}
              className="cursor-pointer group rounded-2xl p-5 border border-border/8 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm 
                         shadow-sm hover:shadow-xl hover:border-primary/45 hover:from-card/80 transition-all duration-200"
            >
              {/* Icon with subtle glow */}
              <div className="flex justify-center mb-4 relative">
                <FolderKanban className="w-14 h-14 text-primary/75 transition-transform duration-200 group-hover:scale-105" />
                <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              </div>

              {/* Folder name */}
              <h3 className="text-[15px]  font-semibold text-center text-foreground truncate mb-2">{folder.name}</h3>

              {/* Articles count */}
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <FileText className="w-3.5 h-3.5 text-primary/70" />
                {folder.articlesCount} {folder.articlesCount === 1 ? "artykuł" : "artykułów"}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
