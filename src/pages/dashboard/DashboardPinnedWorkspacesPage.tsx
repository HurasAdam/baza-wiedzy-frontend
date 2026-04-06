import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layers2 } from "lucide-react";
import { useMemo, useState } from "react";
import { WORKSPACE_ICONS } from "../../components/workspace/workspace-form";

// ---------------- MOCK DATA ----------------
const mockWorkspaces = Array.from({ length: 12 }).map((_, i) => ({
  _id: `${i}`,
  name: `Kolekcja ${i + 1}`,
  items: Math.floor(Math.random() * 20),
  labelColor: "#4F46E5",
  icon: "Layers2",
}));

export function DashboardPinnedWorkspacesPage() {
  const [search, setSearch] = useState("");
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  const filtered = useMemo(
    () => mockWorkspaces.filter((w) => w.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const togglePinned = (id: string) => {
    setPinnedIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen max-w-7xl bg-background p-6 flex flex-col gap-6 px-10 mx-auto ">
      {/* HEADER */}
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 flex items-center justify-center rounded-md text-foreground bg-muted">
          <Layers2 className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground truncate">Przypnij kolekcje</h1>
          <p className="text-2xs text-muted-foreground mt-0.5">Wybierz kolekcje, które chcesz mieć na dashboardzie</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-0 py-2 text-xs text-muted-foreground">
        <Input
          placeholder="Szukaj kolekcji..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl"
        />
      </div>

      {/* WORKSPACES LIST */}
      <div className="flex-grow flex overflow-hidden ">
        <Card className="flex flex-grow flex-col w-full overflow-hidden border-none bg-transparent shadow-none ">
          <CardContent className="flex flex-col flex-grow p-0 overflow-hidden ">
            <ScrollArea className="w-full h-full">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                  Brak wyników
                </div>
              ) : (
                <div className="flex flex-col divide-y border-t border-border ">
                  {filtered.map((workspace) => {
                    const Icon = WORKSPACE_ICONS[workspace.icon] ?? Layers2;
                    const isPinned = pinnedIds.includes(workspace._id);

                    return (
                      <button
                        key={workspace._id}
                        onClick={() => togglePinned(workspace._id)}
                        className={`flex items-center justify-between  w-full px-6 py-3 text-left hover:bg-muted/20 transition ${
                          isPinned ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 ">
                          <div
                            className="w-8 h-8 flex items-center justify-center rounded-lg"
                            style={{ backgroundColor: workspace.labelColor + "20" }}
                          >
                            <Icon className="w-4 h-4" style={{ color: workspace.labelColor }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{workspace.name}</p>
                            <p className="text-xs text-muted-foreground">{workspace.items ?? 0} elementów</p>
                          </div>
                        </div>
                        {isPinned && (
                          <Badge variant="secondary" className="text-xs">
                            Przypięta
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
