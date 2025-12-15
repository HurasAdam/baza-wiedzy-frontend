import { Button } from "@/components/ui/button";
import { WORKSPACE_ICONS } from "@/components/workspace/workspace-form";
import { useFindUserWorkspacesQuery } from "@/hooks/workspace/use-workspace";
import { Layers, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MyWorkspaces = () => {
  const navigate = useNavigate();
  const { data: workspaces = [], isPending } = useFindUserWorkspacesQuery();

  const handleOpenWorkspace = (id: string) => {
    navigate(`/workspace/${id}`);
  };

  const handleCreateWorkspace = () => {
    console.log("TODO: open create workspace modal");
  };

  if (isPending) {
    return <div className="flex items-center justify-center h-[60vh] text-muted-foreground">Ładowanie kolekcji...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full py-8 px-6 lg:px-12 bg-gradient-to-br from-background via-background/90 to-background/60 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Twoje kolekcje</h1>
          <p className="text-muted-foreground text-sm mt-1">Zarządzaj swoimi kolekcjami.</p>
        </div>

        <Button onClick={handleCreateWorkspace} size="sm" className="gap-2 shadow-md hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          Nowa kolekcja
        </Button>
      </div>

      {/* Empty state */}
      {workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <Layers className="w-20 h-20 mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium">Nie masz jeszcze żadnej kolekcji</p>
          <p className="text-sm text-muted-foreground mt-1">Utwórz workspace, aby zacząć organizować wiedzę.</p>
          <Button onClick={handleCreateWorkspace} className="mt-6 gap-2 shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            Dodaj kolekcję
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workspaces.map((ws) => {
            const Icon = WORKSPACE_ICONS[ws.icon] ?? Layers;

            return (
              <div
                key={ws._id}
                onClick={() => handleOpenWorkspace(ws._id)}
                className="cursor-pointer group rounded-2xl p-5 border border-border/40 
                           bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm
                           shadow-sm hover:shadow-xl hover:border-primary/40 
                           hover:from-card/80 transition-all duration-200"
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
    </div>
  );
};
