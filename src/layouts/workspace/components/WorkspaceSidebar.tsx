import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowBigLeft, ChevronDown, Folder, FolderOpen, Lock, Plus } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { WORKSPACE_ICONS } from "../../../components/workspace/workspace-form";
import { sidebarVariants } from "../../../constants/animations";
import { cn } from "../../../lib/utils";
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
  folders,
  workspaces,
  permissions,
  onAddFolder,
  onOpenNewArticle,
  workspaceId,
}: WorkspaceSidebarProps) => {
  const navigate = useNavigate();

  const IconComponent = workspace?.icon && WORKSPACE_ICONS[workspace.icon] ? WORKSPACE_ICONS[workspace.icon] : null;
  console.log("PERMITY", permissions);
  return (
    <motion.aside
      variants={sidebarVariants}
      initial="init"
      animate="visible"
      exit="exit"
      className="flex flex-col border-r bg-background "
    >
      <div className="w-full bg-sidebar">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full focus:outline-none focus:ring-0  ">
            {/* LEFT ICON */}
            <div className="w-16 flex items-center justify-center bg-card/95 border-r">
              {IconComponent && (
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                  style={{
                    background: `${workspace?.labelColor || "#6b7280"}20`,
                  }}
                >
                  <IconComponent className="w-5 h-5" style={{ color: workspace?.labelColor }} />
                </div>
              )}
            </div>

            {/* RIGHT CARD */}
            <div className="w-full pt-2.5 pb-2.5 px-3 flex-1 flex items-center justify-between ">
              <div
                style={{ backgroundColor: workspace?.labelColor ? `${workspace.labelColor}35` : undefined }}
                className="
          flex-1 flex items-center justify-between
          px-3 pt-1.5 pb-1.5
          rounded-xl
          bg-card/70
          border border-l-0
          hover:bg-muted/60
          hover:shadow-sm
          transition-all
        "
              >
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="text-sm font-semibold truncate">{workspace?.name || "Workspace"}</span>
                  <span className="text-xs tracking-wide text-muted-foreground">Kolekcja</span>
                </div>

                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </div>
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

            <DropdownMenuItem className="text-primary font-medium border-t mt-1" onClick={() => {}}>
              + Nowa kolekcja
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-1 min-h-0  ">
        {/* LEFT ICON SIDEBAR */}
        <div className="w-16 border-r bg-card/95 flex flex-col justify-between pt-2.5">
          <div className="flex flex-col gap-3 px-2 mt-2">
            <Button
              size="icon"
              variant="secondary"
              disabled={!permissions?.addArticle}
              className="w-10 h-10 ml-1 p-0 group hover:bg-primary  rounded-lg   transition-all"
              onClick={permissions?.addArticle ? onOpenNewArticle : undefined}
            >
              <Plus size={20} className="group-hover:text-primary-foreground  " />
            </Button>

            <WorkspaceSidebarNavLinks workspaceId={workspaceId} />
          </div>

          <div className="p-2 mb-1 border-t">
            <Button
              variant="ghost"
              size="lg"
              className="w-12 h-12 bg-primary/20 "
              onClick={() => navigate("/articles")}
            >
              <ArrowBigLeft />
            </Button>
          </div>
        </div>

        {/* RIGHT FOLDERS SIDEBAR */}
        <div className="w-[274px] min-w-[260px] max-w-[300px] backdrop-blur-sm flex flex-col min-h-0  bg-sidebar">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-2  border-b border-border/60">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Foldery</h3>

            {permissions?.addFolder ? (
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onAddFolder}>
                <Plus size={16} />
              </Button>
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground opacity-60" />
            )}
          </div>

          {/* LIST */}
          <nav className="flex-1 overflow-y-auto px-2 pt-2 pb-14 space-y-1 scrollbar-custom">
            {folders.length > 0 ? (
              folders.map((folder) => (
                <NavLink
                  key={folder._id}
                  to={`/workspace/${workspaceId}/folders/${folder._id}`}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center justify-between gap-2.5 px-3 py-1 rounded-xl text-sm transition-all duration-200 ease-out",
                      isActive
                        ? "bg-primary/20 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:shadow-sm",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] bg-primary rounded-r" />
                      )}

                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={cn(
                            "flex items-center justify-center w-5.5 h-5.5 rounded-md transition-colors",
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "bg-muted/60 text-muted-foreground/80 group-hover:bg-primary/10 group-hover:text-primary",
                          )}
                        >
                          {isActive ? (
                            <FolderOpen size={14} />
                          ) : (
                            <Folder size={14} className="text-muted-foreground/70" />
                          )}
                        </div>

                        <span className="truncate">{folder.name}</span>
                      </div>

                      {folder.articlesCount > 0 && (
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded-md">
                          {folder.articlesCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 text-muted-foreground space-y-2">
                <Folder className="w-9 h-9 text-muted-foreground/50 " />
                <span className="text-sm font-semibold">Brak folderów</span>
                <span className="text-xs text-muted-foreground/70">
                  Dodaj pierwszy folder i rozpocznij organizację artykułów.
                </span>
                {permissions?.addFolder && (
                  <Button size="sm" variant="secondary" className="mt-2" onClick={onAddFolder}>
                    + Dodaj folder
                  </Button>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </motion.aside>
  );
};
