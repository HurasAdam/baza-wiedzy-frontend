import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { WORKSPACE_ICONS } from "../../../components/workspace/workspace-form";
import { sidebarVariants } from "../../../constants/animations";
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
  permissions?: Record<string, boolean>;
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

  const IconComponent = workspace?.icon && WORKSPACE_ICONS[workspace.icon] ? WORKSPACE_ICONS[workspace.icon] : null;

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="init"
      animate="visible"
      exit="exit"
      className="w-65 border-r bg-card/95 flex flex-col"
    >
      {/* TOP */}
      <div className="border-b px-3 pt-3 pb-3 flex flex-col gap-3">
        {/* WORKSPACE SWITCHER */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors w-full">
            <div className="flex items-center gap-3 min-w-0">
              {IconComponent && (
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg"
                  style={{
                    background: `${workspace?.labelColor || "#6b7280"}20`,
                  }}
                >
                  <IconComponent className="w-5 h-5" style={{ color: workspace?.labelColor }} />
                </div>
              )}

              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate">{workspace?.name || "Workspace"}</span>
                <span className="text-xs text-muted-foreground">Kolekcja</span>
              </div>
            </div>

            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="right" align="start" className="w-56 rounded-lg border shadow-md">
            {workspaces.map((ws) => {
              const IconComp = ws.icon ? WORKSPACE_ICONS[ws.icon] : null;

              return (
                <DropdownMenuItem
                  key={ws._id}
                  className="flex items-center gap-2"
                  onClick={() => navigate(`/workspace/${ws._id}`)}
                >
                  {IconComp && <IconComp className="w-4 h-4" style={{ color: ws.labelColor }} />}

                  <span className="truncate">{ws.name}</span>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuItem className="text-primary font-medium border-t mt-1" onClick={onCreateWorkspace}>
              + Nowa kolekcja
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* NEW ARTICLE BUTTON */}
        <div title={!permissions?.addArticle ? "Brak uprawnień" : ""}>
          <Button
            size="sm"
            variant="secondary"
            className="w-full justify-center relative"
            onClick={permissions?.addArticle ? onOpenNewArticle : undefined}
            disabled={!permissions?.addArticle}
          >
            + Nowy artykuł
            {!permissions?.addArticle && <Lock className="w-4 h-4 text-muted-foreground absolute right-3" />}
          </Button>
        </div>

        {/* NAV LINKS */}
        <WorkspaceSidebarNavLinks workspaceId={workspaceId} />
      </div>

      {/* FOLDERS */}

      <WorkspaceSidebarFoldersList
        folders={folders}
        onAddFolder={onAddFolder}
        isLoading={isLoading}
        permissions={permissions}
      />

      {/* FOOTER */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/articles")}
        >
          Powrót do BW
        </Button>
      </div>
    </motion.aside>
  );
};
