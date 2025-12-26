import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, Lock, MoreVertical, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FolderAuthor {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

export interface FolderData {
  _id: string;
  workspaceId: string;
  name: string;
  createdBy: FolderAuthor;
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceFolderHeaderProps {
  folder?: FolderData;
  isLoading: boolean;
  permissions: Record<string, boolean>;
}

export function WorkspaceFolderHeader({ folder, isLoading, permissions }: WorkspaceFolderHeaderProps) {
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="flex items-center justify-between  pb-5 mb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-md" />
          <Skeleton className="w-32 h-5" />
        </div>
        <Skeleton className="w-24 h-8 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between shadow-sm bg-background  pb-2 mb-4 ">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Folder className="text-primary w-5.5 h-5.5" />
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">Folder</p>
          <h1 className="text-xl font-semibold leading-tight truncate  max-w-[450px]">{folder?.name}</h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button
          disabled={!permissions.addArticle}
          onClick={() => navigate(`/workspace/${folder?.workspaceId}/new-article`)}
          variant="outline"
          size="sm"
        >
          {!permissions.addArticle ? <Lock className="w-3 h-3" /> : <Plus className="w-4 h-4 mr-1" />}Nowy artykuł
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background shadow-lg rounded-md">
            <DropdownMenuItem onClick={() => console.log("Edytuj folder")}>Edytuj folder</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => console.log("Usuń folder")}>
              Usuń folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
