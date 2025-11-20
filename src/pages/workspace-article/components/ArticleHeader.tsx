import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, FolderOpenDot, MoreHorizontal, User } from "lucide-react";

interface ArticleHeaderProps {
  title: string;
  folderName: string;
  createdBy: { name: string; surname: string };
  createdAt: string;
  onBack: () => void;
  onEditArticle: () => void;
  onAddVariant: () => void;
  onChangeFolder: () => void;
}

function ArticleHeader({
  title,
  folderName,
  createdBy,
  createdAt,
  onBack,
  onEditArticle,
  onAddVariant,
  onChangeFolder,
}: ArticleHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Back */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="w-fit px-2 py-1 h-auto text-muted-foreground text-[13px] gap-2 
        hover:text-foreground hover:bg-muted/60 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Wróć
      </Button>

      {/* Title + More Icon */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground/90">{title}</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1 rounded-md hover:bg-muted transition
              text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onClick={onEditArticle}>Edytuj artykuł</DropdownMenuItem>
            <DropdownMenuItem onClick={onAddVariant}>Dodaj wariant</DropdownMenuItem>
            <DropdownMenuItem onClick={onChangeFolder}>Przenieś</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Folder */}
      <p className="text-sm text-muted-foreground flex items-center gap-1">
        <FolderOpenDot className="w-4 h-4 text-amber-400/45" />
        <span className="font-medium">{folderName}</span>
      </p>

      {/* Author */}
      <p className="text-sm text-muted-foreground flex items-center gap-1">
        <User className="w-4 h-4 text-muted-foreground/70" />
        <span>
          {createdBy.name} {createdBy.surname}
        </span>
        <span className="mx-1">•</span>
        <span>{new Date(createdAt).toLocaleString()}</span>
      </p>
    </div>
  );
}

export default ArticleHeader;
