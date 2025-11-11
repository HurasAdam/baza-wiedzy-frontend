import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { WorkspaceSidebarFoldersList } from "./WorkspaceSidebarFoldersList";
import { WorkspaceSidebarNavLinks } from "./WorkspaceSidebarNavLinks ";

interface WorkspaceSidebarProps {
  isLoading: boolean;
  workspaceId: string;
  folders: {
    _id: string;
    workspaceId: string;
    name: string;
    createdBy: string;
    updatedBy: string;
    articlesCount: number;
  }[];
  onAddFolder: () => void;
  onOpenNewArticle: () => void;
}

export const WorkspaceSidebar = ({
  isLoading,
  workspaceId,
  folders,
  onAddFolder,
  onOpenNewArticle,
}: WorkspaceSidebarProps) => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 border-r flex flex-col bg-gradient-to-b from-background/80 via-background/60 to-background/30 backdrop-blur-xl shadow-inner">
      <div className="border-b flex flex-col">
        <h2 className="text-lg font-semibold tracking-tight mb-2 px-2 pt-2">Workspaces</h2>

        <div className="px-2 py-2">
          <Button size="sm" variant="outline" className="w-full" onClick={onOpenNewArticle}>
            + Nowy artykuł
          </Button>
        </div>

        <WorkspaceSidebarNavLinks workspaceId={workspaceId} />
      </div>

      <WorkspaceSidebarFoldersList folders={folders} onAddFolder={onAddFolder} isLoading={isLoading} />

      <div className="border-t p-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center text-xs"
          onClick={() => navigate("/articles")}
        >
          Powrót do BW
        </Button>
      </div>
    </aside>
  );
};
