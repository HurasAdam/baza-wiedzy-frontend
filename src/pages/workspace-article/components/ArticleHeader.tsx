import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderOpenDot, User } from "lucide-react";

interface ArticleHeaderProps {
  title: string;
  folderName: string;
  createdBy: { name: string; surname: string };
  createdAt: string;
  onBack: () => void;
}

function ArticleHeader({ title, folderName, createdBy, createdAt, onBack }: ArticleHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={onBack}
        variant="ghost"
        className="w-fit px-2 py-1 h-auto text-muted-foreground text-[13px] gap-2 
        hover:text-foreground hover:bg-muted/60 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Wróć
      </Button>

      <h1 className="text-2xl font-bold text-foreground/90">{title}</h1>

      <p className="text-sm text-muted-foreground flex items-center gap-1">
        <FolderOpenDot className="w-4 h-4 text-amber-400/45" />
        <span className="font-medium">{folderName}</span>
      </p>

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
