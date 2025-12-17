import { Button } from "@/components/ui/button";
import { ArrowRight, Flag, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { toast } from "sonner";
import { EditFlagModal } from "../../components/flag/edit-flag-modal";
import { FlagModal, type FlagForm } from "../../components/flag/flag-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import queryClient from "../../config/query.client";
import { useCreateFlagMutation, useFindMyFlagsWithStats } from "../../hooks/flag/user-flag";

export const MyFlagsPage = () => {
  const navigate = useNavigate();
  const { data: userFlags = [], isLoading: isFlagsLoading } = useFindMyFlagsWithStats(true);
  const { mutate: createFlagMutate, isPending: isCreateFlagPending } = useCreateFlagMutation();

  const [isCreateFlagModalOpen, setIsCreateFlagModalOpen] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<null | string>(null);

  const handleCreateFlag = () => {
    setIsCreateFlagModalOpen(true);
  };
  const onCreateFlag = (data: FlagForm) => {
    createFlagMutate(data, {
      onSuccess: () => {
        toast.success("Zapisano zmian", {
          position: "bottom-right",
          description: "Dodano nową flagę",
        });
        setIsCreateFlagModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["my-flags-with-stats"] });
      },
    });
  };

  const handleEditFlag = (flagId: string) => setSelectedFlag(flagId);
  const handleDeleteFlag = (flagId: string) => console.log("Delete flag", flagId);

  if (isFlagsLoading) {
    return <div className="flex items-center justify-center h-[60vh] text-muted-foreground">Ładowanie etykiet…</div>;
  }

  return (
    <div className="flex flex-col h-full w-full py-6 px-8 lg:px-12 bg-gradient-to-br from-background via-background/90 to-background/60 backdrop-blur-md max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Moje etykiety</h1>
          <p className="text-muted-foreground text-sm mt-1">Zarządzaj dodanymi etykietami</p>
        </div>
        <Button onClick={handleCreateFlag} size="sm" className="gap-2 shadow-md hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          Nowa etykieta
        </Button>
      </div>

      {/* Empty state */}
      {userFlags.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <Flag className="w-24 h-24 mb-6 text-muted-foreground/50" />
          <p className="text-xl font-medium">Nie masz jeszcze etykiet</p>
          <p className="text-sm text-muted-foreground mt-2 text-center max-w-xs">
            Utwórz etykietę, aby lepiej organizować treści.
          </p>
          <Button onClick={handleCreateFlag} className="mt-6 gap-2 shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            Dodaj etykietę
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {userFlags.map((flag) => (
            <div
              key={flag._id}
              className="group relative border rounded-xl p-4 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm
                         shadow-sm hover:bg-muted/40 transition-all flex flex-col justify-between"
            >
              {/* Top left*/}
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl"
                  style={{ backgroundColor: `${flag.color}22` }}
                >
                  <Flag className="w-5 h-5" style={{ color: flag.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground truncate">{flag.name}</h3>
                </div>
              </div>

              {/* Top right*/}
              <div className="absolute top-2 right-2">
                <Button size="icon" variant="ghost" onClick={() => navigate(`/flagged-articles?flag=${flag._id}`)}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Bottom left */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground font-medium">
                  {flag.articlesCount ?? 0} {flag.articlesCount === 1 ? "artykuł" : "artykułów"}
                </p>
              </div>

              {/* Bottom right*/}
              <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => handleEditFlag(flag._id)}>
                      <Pencil className="w-3 h-3" />
                      Edytuj
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={() => handleDeleteFlag(flag._id)}>
                      <Trash2 className="w-3 h-3" />
                      Usuń
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      <FlagModal
        isLoading={isCreateFlagPending}
        onSave={onCreateFlag}
        isOpen={isCreateFlagModalOpen}
        setIsOpen={setIsCreateFlagModalOpen}
      />

      {selectedFlag && (
        <EditFlagModal
          selectedFlag={selectedFlag}
          isOpen={!!selectedFlag}
          setIsOpen={(open) => {
            if (!open) setSelectedFlag(null);
          }}
          onSave={() => {}}
          isLoading={false}
        />
      )}
    </div>
  );
};
