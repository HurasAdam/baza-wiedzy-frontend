import { Settings } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import WorkspaceForm, { colorOptions } from "../../components/workspace/workspace-form";
import queryClient from "../../config/query.client";
import { useUpdateWorkspaceMutation } from "../../hooks/workspace/use-workspace";

export const WorkspaceManageSettingsPage = () => {
  const { mutate, isPending } = useUpdateWorkspaceMutation();
  const { workspace, permissions } = useOutletContext();

  const onSubmit = (data) => {
    mutate(
      { workspaceId: workspace._id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["workspace", workspace._id] });
          toast.success("Zapisano zmiany", {
            position: "bottom-right",
            description: "Dane kolekcji zostały zaktualizowane",
          });
        },
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8  ">
      <header className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-muted-foreground" />
            <h1 className="text-2xl font-semibold tracking-tight">Ustawienia kolekcji</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Zarządzaj ustawieniami kolekcji.</p>
        </div>
      </header>
      <Separator />
      {!workspace ? (
        <WorkspaceFormSkeleton />
      ) : workspace ? (
        <WorkspaceForm workspace={workspace} onSubmit={onSubmit} isLoading={isPending} permissions={permissions} />
      ) : (
        <div>Workspace nie istnieje</div>
      )}
    </div>
  );
};

import { toast } from "sonner";
import { cn } from "../../lib/utils";

export const WorkspaceFormSkeleton = () => {
  return (
    <div className="space-y-8 py-4 animate-pulse">
      {/* Nazwa */}
      <div className="space-y-2">
        <div className="h-5 w-24 bg-muted/25 rounded" /> {/* FormLabel */}
        <div className="h-10 w-full bg-muted/25 rounded" /> {/* Input */}
      </div>

      {/* Opis */}
      <div className="space-y-2">
        <div className="h-5 w-20 bg-muted/25 rounded" /> {/* FormLabel */}
        <div className="h-24 w-full bg-muted/25 rounded" /> {/* Textarea */}
      </div>

      {/* Kolor */}
      <div className="space-y-2">
        <div className="h-5 w-14 bg-muted/25 rounded" /> {/* FormLabel */}
        <div className="flex gap-3 flex-wrap">
          {colorOptions.map((color) => (
            <div key={color} className={cn("w-6 h-6 rounded-full bg-card")} />
          ))}
        </div>
      </div>

      {/* Ikona */}
      <div className="space-y-2">
        <div className="h-5 w-14 bg-muted/25 rounded" /> {/* FormLabel */}
        <div className="flex gap-3 flex-wrap">
          {Array.from(8).map((iconName) => (
            <div key={iconName} className="w-10 h-10 bg-card rounded-md border" />
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <div className="h-10 w-24 bg-muted/25 rounded" />
      </div>
    </div>
  );
};
