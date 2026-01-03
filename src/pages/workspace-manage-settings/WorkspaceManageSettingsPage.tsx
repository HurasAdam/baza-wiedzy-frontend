import { MoreVertical, Settings, Trash2 } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import WorkspaceForm, { colorOptions } from "../../components/workspace/workspace-form";
import queryClient from "../../config/query.client";
import { useDeleteWorkspaceMutation, useUpdateWorkspaceMutation } from "../../hooks/workspace/use-workspace";

export const WorkspaceManageSettingsPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useUpdateWorkspaceMutation();
  const { mutate: deleteWorkspaceMutate, isPending: isDeleteWorkspacePending } = useDeleteWorkspaceMutation();
  const { workspace, permissions } = useOutletContext();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  const onDelete = () => {
    setIsDeleteOpen(true);
  };

  const onDeleteWorkspaceConfirm = () => {
    deleteWorkspaceMutate(workspace._id, {
      onSuccess: () => {
        toast.success("Zmiany zostały zapisane", {
          position: "bottom-right",
          description: "Kolekcja oraz wszystkie jej zasoby zostały usunięte",
        });
        setIsDeleteOpen(false);
        navigate("/");
      },
    });
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

        {permissions?.isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onDelete} className="text-foreground text-sm ">
                <Trash2 className="mr-2 h-3 w-3" />
                Usuń kolekcję
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>
      <Separator />
      {!workspace ? (
        <WorkspaceFormSkeleton />
      ) : workspace ? (
        <WorkspaceForm workspace={workspace} onSubmit={onSubmit} isLoading={isPending} permissions={permissions} />
      ) : (
        <div>Workspace nie istnieje</div>
      )}

      <Alert
        isOpen={isDeleteOpen}
        type="warning"
        title="Usunąć kolekcję?"
        isLoading={isDeleteWorkspacePending}
        requireConfirmation
        isConfirmEnabled
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={onDeleteWorkspaceConfirm}
      >
        <p className="text-sm text-muted-foreground mb-3">Czy jesteś pewien że chcesz usunąć te kolekcję ?</p>

        <p className="text-sm text-muted-foreground mt-2">
          Wszystkie foldery oraz artykuły przypisane do tej kolekcji zostaną trwale usunięte - operacja ta jest
          <span className="font-medium mx-1.5 text-destructive">nieodwracalna</span>!
        </p>
      </Alert>
    </div>
  );
};

import { useState } from "react";
import { toast } from "sonner";
import { Alert } from "../../components/shared/alert-modal";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
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
