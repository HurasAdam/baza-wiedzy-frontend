import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Layers2, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

// ---------------- MOCK DATA ----------------
const mockCollections = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `Kolekcja ${i + 1}`,
  items: Math.floor(Math.random() * 20),
}));

export function DashboardPinnedWorkspacesPage() {
  const [search, setSearch] = useState("");

  const filteredCollections = mockCollections.filter((col) => col.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Przypięte kolekcje</h1>
            <p className="text-muted-foreground text-sm mt-1">Zarządzaj swoimi kolekcjami</p>
          </div>

          <Button className="rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Dodaj kolekcję
          </Button>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj kolekcji..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>

        {/* COLLECTIONS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
          {filteredCollections.map((col) => (
            <Card key={col.id} className="rounded-xl border hover:shadow-md transition group">
              <CardContent className="p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10">
                    <Layers2 className="w-4 h-4 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{col.name}</p>
                    <Badge variant="secondary" className="text-[10px] mt-0.5">
                      {col.items} elementów
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                  <Button size="icon" variant="ghost" className="h-7 w-7">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredCollections.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground mt-4">
              Brak kolekcji spełniających kryteria wyszukiwania
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
