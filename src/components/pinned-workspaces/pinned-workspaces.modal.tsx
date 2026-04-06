import type { AxiosError } from "axios";
import { Layers2, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import {
  useCreatePinnedWorkspaceMutation,
  useDeletePinnedWorkspaceMutation,
  useFindUserPinnedWorkspacesQuery,
} from "../../hooks/pinned-workspaces/use-pinned-workspaces";
import { useFindUserWorkspacesQuery } from "../../hooks/workspace/use-workspace";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { WORKSPACE_ICONS } from "../workspace/workspace-form";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  closeOnOutsideClick?: boolean;
}

export const PinnedWorkspacesModal = ({ isOpen, setIsOpen, closeOnOutsideClick = false }: Props) => {
  const { data: workspaces = [], isPending } = useFindUserWorkspacesQuery();
  const { data: pinned = [] } = useFindUserPinnedWorkspacesQuery();

  const [isMutating, setIsMutating] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null); // spinner tylko dla klikniętej kolekcji
  const [search, setSearch] = useState("");

  const { mutate: pinWorkspaceMutate } = useCreatePinnedWorkspaceMutation();
  const { mutate: unpinWorkspaceMutate } = useDeletePinnedWorkspaceMutation();

  const pinnedIds = useMemo(() => pinned.map((p) => p.workspace._id), [pinned]);

  const filtered = useMemo(
    () => workspaces.filter((w) => w.name.toLowerCase().includes(search.toLowerCase())),
    [search, workspaces],
  );

  const togglePinned = (id: string) => {
    if (isMutating) return;

    const isPinned = pinnedIds.includes(id);
    setIsMutating(true);
    setActiveId(id);

    const onSettled = () => {
      setIsMutating(false);
      setActiveId(null);
      queryClient.invalidateQueries({ queryKey: ["my-pinned-workspaces"] });
    };

    if (isPinned) {
      unpinWorkspaceMutate(id, { onSettled });
    } else {
      pinWorkspaceMutate(
        { workspace: id },
        {
          onError: (error) => {
            setIsMutating(false);
            setActiveId(null);

            const { status } = error as AxiosError;
            if (status === 409) toast.error("Wybrana kolekcja została już przypięta.");
            else if (status === 422) {
              toast.warning("Osiągnięto maksymalny limit przypięć", {
                position: "bottom-right",
                description: "Twoja tablica może mieć maksymalnie 14 przypiętych kolekcji. Usuń jedną, aby dodać nową.",
                duration: 5500,
              });
            } else {
              toast.error("Nieoczekiwany błąd. Odśwież stronę i spróbuj ponownie.");
            }
          },
          onSettled,
        },
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="max-h-[83vh] min-h-[83vh] md:min-w-[70vw] xl:min-w-[60vw] flex flex-col p-0 gap-0 rounded-xl shadow-xl bg-background overflow-hidden"
      >
        <DialogHeader className="flex items-start justify-between gap-4 border-b border-border px-6 pt-4 pb-2.5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg text-foreground bg-muted">
              <Layers2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold truncate">Przypnij kolekcje</h3>
              <p className="text-2xs text-muted-foreground mt-0.5">Wybierz kolekcje do przypięcia na tablicy</p>
            </div>
          </div>
          <div className="w-6" />
        </DialogHeader>

        <div className="px-6 py-2 border-b border-border bg-muted/30">
          <Input placeholder="Szukaj kolekcji..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="flex-grow flex overflow-hidden">
          <Card className="flex flex-grow flex-col w-full border-none bg-transparent shadow-none">
            <CardContent className="flex flex-col flex-grow p-0 overflow-hidden">
              <div className="flex sticky items-center justify-between px-6 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground border-t border-b border-border bg-muted/40">
                <div className="flex items-center gap-3">
                  <div className="w-8" />
                  <span>Nazwa</span>
                </div>
                <div className="flex items-center gap-18">
                  <span className="w-[150px]">Właściciel</span>
                  <span className="w-[100px]">Status</span>
                </div>
              </div>

              <ScrollArea className="w-full h-full">
                {isPending ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">Ładowanie...</div>
                ) : filtered.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">Brak wyników</div>
                ) : (
                  <div className="flex flex-col divide-y border-b border-border pb-12">
                    {filtered.map((workspace) => {
                      const Icon = WORKSPACE_ICONS[workspace.icon] ?? Layers2;
                      const isPinned = pinnedIds.includes(workspace._id);
                      const isLoading = activeId === workspace._id && isMutating;

                      return (
                        <button
                          key={workspace._id}
                          onClick={() => togglePinned(workspace._id)}
                          disabled={isMutating}
                          className={cn(
                            "flex items-center justify-between w-full px-6 py-3 text-left hover:bg-primary/10 transition",
                            isPinned && "bg-primary/5",
                            isMutating && "opacity-60 pointer-events-none cursor-not-allowed",
                          )}
                        >
                          {/* LEWA */}
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 flex items-center justify-center rounded-lg"
                              style={{ backgroundColor: workspace.labelColor + "20" }}
                            >
                              <Icon className="w-4 h-4" style={{ color: workspace.labelColor }} />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-sm font-medium truncate">{workspace.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(workspace.createdAt).toLocaleDateString("pl-PL")}
                              </p>
                            </div>
                          </div>

                          {/* PRAWA */}
                          <div className="flex items-center gap-22">
                            <div className="flex items-center gap-2.5 w-[150px]">
                              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-muted text-xs font-medium">
                                {workspace.owner.name[0]}
                                {workspace.owner.surname[0]}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {workspace.owner.name} {workspace.owner.surname}
                              </p>
                            </div>

                            {isLoading ? (
                              <div className="min-w-[100px] flex justify-center">
                                <Loader2 className="animate-spin w-5 h-5" />
                              </div>
                            ) : isPinned ? (
                              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 w-[100px] text-primary text-[10px] font-medium uppercase tracking-wider">
                                ✔ Przypięta
                              </div>
                            ) : (
                              <div className="w-[100px]" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
