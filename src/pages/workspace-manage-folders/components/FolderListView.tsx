import { Folder, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";
import type { Folder as IFolder } from "./ManageFoldersFilters";

interface FolderListViewProps {
  view: "grid" | "list";
  folders: IFolder[];
  openEdit: (folder: IFolder) => void;
  openDelete: (folder: IFolder) => void;
}

const FolderListView = ({ view, folders, openEdit, openDelete }: FolderListViewProps) => {
  if (view === "grid") {
    return (
      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => (
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        disabled={folder.articlesCount > 0}
                        variant="ghost"
                        size="icon"
                        onClick={() => openDelete(folder)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {folder.articlesCount > 0 && (
                    <TooltipContent side="right" align="start" className="bg-muted p-3 space-y-1">
                      <p>Nie można usunąć folderu zawierającego artykuły</p>
                      <p>Usuń lub przenieś powiązane artykuły przed usunięciem folderu</p>
                    </TooltipContent>
                  )}
                </Tooltip>
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
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="mt-6">
        <div className="space-y-2">
          {folders.map((folder) => (
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        disabled={folder.articlesCount > 0}
                        variant="ghost"
                        size="icon"
                        onClick={() => openDelete(folder)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {folder.articlesCount > 0 && (
                    <TooltipContent className="bg-muted p-3 space-y-1">
                      <p>Nie można usunąć folderu zawierającego artykuły</p>
                      <p>Usuń lub przenieś powiązane artykuły przed usunięciem folderu</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default FolderListView;
