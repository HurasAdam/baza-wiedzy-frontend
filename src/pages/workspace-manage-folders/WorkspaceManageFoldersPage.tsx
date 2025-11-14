import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Folder, Grid, List, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { EditWorkspaceFolderModal } from "../../components/workspace-folder/EditWorkspaceFolderModal";

export const WorkspaceManageFoldersPage = () => {
  const { folders, workspace, handleAddFolder } = useOutletContext<{ folders: any[] }>();

  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("list");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<any | null>(null);
  const [formName, setFormName] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? folders.filter((f) => f.name.toLowerCase().includes(q)) : folders;
  }, [folders, query]);

  const openAdd = () => {
    setFormName("");
    setIsAddOpen(true);
  };

  const openEdit = (folder: any) => {
    setSelectedFolder(folder);
    setFormName(folder.name);
    setIsEditOpen(true);
  };

  const openDelete = (folder: any) => {
    setSelectedFolder(folder);
    setIsDeleteOpen(true);
  };

  return (
    <div className="py-6 w-full ">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Zarządzaj folderami</h1>
            <p className="text-sm text-muted-foreground mt-1">Organizuj swoje foldery w workspace.</p>
          </div>
          <Button onClick={handleAddFolder}>
            <Plus className="w-4 h-4 mr-2" /> Nowy folder
          </Button>
        </div>

        <Separator className="my-4" />

        {/* FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-1/2">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj folderów..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
              title="Widok listy"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
              title="Widok siatki"
            >
              <Grid className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">
                  Sortuj <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => folders.sort((a, b) => a.name.localeCompare(b.name))}>
                  Nazwa (A–Z)
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => folders.sort((a, b) => b.articlesCount - a.articlesCount)}>
                  Najwięcej artykułów
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-6">
          {filtered.length === 0 ? (
            <div className="border border-dashed border-muted rounded-xl p-12 text-center">
              <Folder className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-medium text-lg">Brak folderów</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Utwórz folder, aby zacząć organizować swoje artykuły.
              </p>
              <Button onClick={handleAddFolder} className="mt-4">
                <Plus className="w-4 h-4 mr-2" /> Utwórz folder
              </Button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((folder) => (
                <div
                  key={folder._id}
                  className="group border rounded-xl p-4 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm 
                         shadow-sm hover:bg-muted/40 transition-all flex flex-col justify-between "
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        <Folder className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-medium truncate">{folder.name}</h3>
                      <p className="text-sm text-muted-foreground">{folder.articlesCount} artykułów</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(folder)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDelete(folder)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => alert("Udostępnij – mock")}>Udostępnij</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((folder) => (
                <div
                  key={folder._id}
                  className="flex items-center justify-between border rounded-lg px-4 py-3 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm 
                         shadow-sm hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 px-2">
                    <Folder className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{folder.name}</span>
                    <Badge variant="secondary">{folder.articlesCount}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(folder)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDelete(folder)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditWorkspaceFolderModal
        isEditingWorkspaceFolder={isEditOpen}
        setIsEditingWorkspaceFolder={setIsEditOpen}
        folderId={selectedFolder?._id}
        workspaceId={workspace._id}
      />

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuń folder</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Czy na pewno chcesz usunąć folder <strong>{selectedFolder?.name}</strong>?
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
              Anuluj
            </Button>
            <Button variant="destructive">Usuń</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
