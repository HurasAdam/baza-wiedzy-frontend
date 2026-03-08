import { Button } from "@/components/ui/button";
import { WORKSPACE_ICONS } from "@/components/workspace/workspace-form";
import { useFindUserWorkspacesQuery } from "@/hooks/workspace/use-workspace";
import { motion } from "framer-motion";
import { Layers, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { CreateWorkspaceModal } from "../../components/workspace/CreateWorkspaceModal";
import * as animation from "../../constants/animations";
import { useAuthQuery } from "../../hooks/auth/use-auth";

export const MyWorkspaces = () => {
  const navigate = useNavigate();
  const { data: user } = useAuthQuery();
  const { data: workspaces = [], isPending } = useFindUserWorkspacesQuery();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState<boolean>(false);
  const backendBase = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:5000";

  const userPermissions = user?.role?.permissions || [];

  const handleOpenWorkspace = (id: string) => navigate(`/workspace/${id}`);
  const onCreateWorkspace = () => setIsCreatingWorkspace(true);
  const onCloseCreateWorkspaceModal = () => setIsCreatingWorkspace(false);

  if (isPending) {
    return <div className="flex items-center justify-center h-[60vh] text-muted-foreground">Ładowanie kolekcji...</div>;
  }

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="flex flex-col h-full w-full py-6 px-10 max-w-6xl mx-auto backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Moje kolekcje</h1>
          <p className="text-muted-foreground text-sm mt-1">Zarządzaj swoimi kolekcjami.</p>
        </div>
        {userPermissions.includes("ADD_COLLECTION") && (
          <Button
            onClick={onCreateWorkspace}
            size="sm"
            className="gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Nowa kolekcja
          </Button>
        )}
      </div>

      {/* Empty state */}
      {workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <Layers className="w-20 h-20 mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium">Nie masz jeszcze żadnej kolekcji</p>
          <p className="text-sm text-muted-foreground mt-1">Utwórz workspace, aby zacząć organizować wiedzę.</p>
          {userPermissions.includes("ADD_COLLECTION") && (
            <Button onClick={onCreateWorkspace} className="mt-6 gap-2 shadow-md hover:shadow-lg transition-all">
              <Plus className="w-4 h-4" /> Dodaj kolekcję
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {workspaces.map((ws) => {
            const Icon = WORKSPACE_ICONS[ws.icon] ?? Layers;

            const avatarUrl = ws.owner?.profilePicture?.path
              ? `${backendBase}${ws.owner?.profilePicture?.path.replace(/^\/app/, "")}`
              : null;

            const initials = `${ws.owner?.name?.[0] ?? ""}${ws.owner?.surname?.[0] ?? ""}`.toUpperCase() || "U";

            return (
              <div
                key={ws._id}
                onClick={() => handleOpenWorkspace(ws._id)}
                className="group relative border rounded-2xl p-6 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm
             shadow-sm hover:shadow-xl hover:border-primary/45 hover:from-card/80 transition-all duration-200
             flex flex-col gap-4 cursor-pointer"
              >
                <div className="flex flex-col 2xl:flex-row items-start gap-3">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: `${ws.labelColor}22` }}
                  >
                    <Icon
                      className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: ws.labelColor }}
                    />
                  </div>

                  <div className="flex-1 ">
                    <h2
                      className="text-[16px] font-semibold text-foreground leading-tight break-words xl:truncate max-w-[300px] xl:max-w-[220px]"
                      title={ws.name}
                    >
                      {ws.name}
                    </h2>
                  </div>
                </div>

                {ws.description && (
                  <p className="text-[13px] text-muted-foreground line-clamp-2 mt-1">{ws.description}</p>
                )}

                <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/40">
                  {avatarUrl ? (
                    <Avatar className="w-10 h-10 rounded-full ring-1 ring-border/40 bg-background">
                      <AvatarImage src={avatarUrl ?? undefined} alt={user?.name ?? "Avatar"} crossOrigin="anonymous" />
                      <AvatarFallback className="bg-primary/70 rounded-lg text-primary-foreground text-full font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                      {initials}
                    </div>
                  )}

                  <div className="flex flex-col leading-tight">
                    <span className="text-[12px] text-foreground font-medium">
                      {ws.owner?.name} {ws.owner?.surname}
                    </span>

                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Właściciel</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isCreatingWorkspace && (
        <CreateWorkspaceModal
          isCreatingWorkspace={isCreatingWorkspace}
          setIsCreatingWorkspace={setIsCreatingWorkspace}
          onClose={onCloseCreateWorkspaceModal}
        />
      )}
    </motion.div>
  );
};
