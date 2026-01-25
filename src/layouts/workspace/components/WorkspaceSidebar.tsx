import { Button } from "@/components/ui/button";
import { ChevronDown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { WORKSPACE_ICONS } from "../../../components/workspace/workspace-form";
import { WorkspaceSidebarFoldersList } from "./WorkspaceSidebarFoldersList";
import { WorkspaceSidebarNavLinks } from "./WorkspaceSidebarNavLinks ";

export interface Workspace {
  _id: string;
  name: string;
  icon: string;
  description: string;
  labelColor: string;
  owner: string;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceSidebarProps {
  workspace: Workspace;
  workspaces: Workspace[];
  isLoading: boolean;
  workspaceId: string;
  folders: {
    _id: string;
    workspaceId: string;
    name: string;
    createdBy: string;
    updatedBy: string;
    articlesCount: number;
    permissions?: Record<string, boolean>;
  }[];
  onAddFolder: () => void;
  onOpenNewArticle: () => void;
  onCreateWorkspace: () => void;
}

export const WorkspaceSidebar = ({
  workspace,
  workspaces,
  isLoading,
  workspaceId,
  folders,
  permissions,
  onAddFolder,
  onOpenNewArticle,
  onCreateWorkspace,
}: WorkspaceSidebarProps) => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 border-r  flex flex-col bg-gradient-to-b from-background/80 via-background/60 to-background/30 backdrop-blur-xl shadow-inner">
      <div className="border-b flex flex-col px-2 pt-2 pb-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center hover:bg-muted/15 gap-3 p-3 mb-3 rounded-xl bg-gradient-to-r from-background/20 via-background/10 to-background/20 shadow-sm w-full justify-between">
            <div className="flex items-center gap-3">
              {workspace?.icon &&
                WORKSPACE_ICONS[workspace.icon] &&
                (() => {
                  const IconComponent = WORKSPACE_ICONS[workspace.icon];
                  return <IconComponent className="w-6 h-6" style={{ color: workspace.labelColor || "#6b7280" }} />;
                })()}
              <div className="flex flex-col">
                <h2 className="text-md font-semibold text-foreground truncate">{workspace?.name || "Workspace"}</h2>
                {workspace?.description && <span className="text-xs text-muted-foreground truncate">kolekcja</span>}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="start"
            className="w-full px-2 bg-background rounded-xl shadow-lg border border-border"
          >
            {workspaces.map((ws) => {
              const IconComp = ws.icon ? WORKSPACE_ICONS[ws.icon] : null;
              return (
                <DropdownMenuItem
                  key={ws._id}
                  className="flex items-center gap-2"
                  onClick={() => navigate(`/workspace/${ws._id}`)}
                >
                  {IconComp && <IconComp className="w-5 h-5" style={{ color: ws.labelColor }} />}
                  <span className="truncate">{ws.name}</span>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuItem
              className="text-primary font-medium mt-1 border-t border-border"
              onClick={onCreateWorkspace}
            >
              + Nowa kolekcja
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="px-0.5 py-1" title={!permissions?.addArticle ? "Brak uprawnień" : ""}>
          <Button
            size="sm"
            variant={permissions?.addArticle ? "outline" : "ghost"}
            className="w-full flex items-center justify-center gap-2 relative disabled:border"
            onClick={permissions?.addArticle ? onOpenNewArticle : undefined}
            disabled={!permissions?.addArticle}
          >
            + Nowy artykuł
            {!permissions?.addArticle && (
              <Lock className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
            )}
          </Button>
        </div>

        <WorkspaceSidebarNavLinks workspaceId={workspaceId} />
      </div>

      <WorkspaceSidebarFoldersList
        folders={folders}
        onAddFolder={onAddFolder}
        isLoading={isLoading}
        permissions={permissions}
      />

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
