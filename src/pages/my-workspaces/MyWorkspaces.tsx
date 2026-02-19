import { Button } from "@/components/ui/button";
import { WORKSPACE_ICONS } from "@/components/workspace/workspace-form";
import { useFindUserWorkspacesQuery } from "@/hooks/workspace/use-workspace";
import { motion } from "framer-motion";
import { Layers, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateWorkspaceModal } from "../../components/workspace/CreateWorkspaceModal";
import * as animation from "../../constants/animations";
import { useAuthQuery } from "../../hooks/auth/use-auth";

export const MyWorkspaces = () => {
  const navigate = useNavigate();
  const { data: user } = useAuthQuery();
  const { data: workspaces = [], isPending } = useFindUserWorkspacesQuery();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState<boolean>(false);

  const userPermissions = user?.role?.permissions || [];

  console.log("U", userPermissions);

  const handleOpenWorkspace = (id: string) => {
    navigate(`/workspace/${id}`);
  };

  const onCreateWorkspace = () => {
    setIsCreatingWorkspace(true);
  };

  const onCloseCreateWorkspaceModal = () => {
    setIsCreatingWorkspace(false);
  };

  if (isPending) {
    return <div className="flex items-center justify-center h-[60vh] text-muted-foreground">Ładowanie kolekcji...</div>;
  }

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="flex flex-col h-full w-full py-4 px-6 lg:px-12 bg-gradient-to-br from-background via-background/90 to-background/60 backdrop-blur-md max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Moje kolekcje</h1>
          <p className="text-muted-foreground text-sm mt-1">Zarządzaj swoimi kolekcjami.</p>
        </div>
        {userPermissions.includes("ADD_COLLECTION") && (
          <Button
            onClick={onCreateWorkspace}
            size="sm"
            className="gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Nowa kolekcja
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
              <Plus className="w-4 h-4" />
              Dodaj kolekcję
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {workspaces.map((ws) => {
            const Icon = WORKSPACE_ICONS[ws.icon] ?? Layers;

            return (
              <div
                key={ws._id}
                onClick={() => handleOpenWorkspace(ws._id)}
                className="group relative border rounded-xl p-4 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm
                         shadow-sm hover:bg-muted/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ backgroundColor: `${ws.labelColor}22` }}
                  >
                    <Icon
                      className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: ws.labelColor }}
                    />
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {new Date(ws.createdAt).toLocaleDateString("pl-PL")}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-foreground truncate mb-1">{ws.name}</h2>

                {ws.description && <p className="text-sm text-muted-foreground line-clamp-2">{ws.description}</p>}
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
