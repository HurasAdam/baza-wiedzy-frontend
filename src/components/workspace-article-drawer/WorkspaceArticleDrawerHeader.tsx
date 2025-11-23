import { FolderOpenDot } from "lucide-react";
import { SheetHeader } from "../ui/sheet";

const WorkspaceArticleDrawerHeader = ({ article }) => {
  if (!article) return null;

  return (
    <SheetHeader className="border-b border-border pb-3 flex flex-col gap-2">
      {/* Title */}
      <h1 className="text-2xl font-bold text-foreground/90">{article.title}</h1>

      {/* Folder */}
      {article.folder && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <FolderOpenDot className="w-4 h-4 text-amber-400/50" />
          <span className="font-medium">{article.folder.name}</span>
        </p>
      )}
    </SheetHeader>
  );
};

export default WorkspaceArticleDrawerHeader;
