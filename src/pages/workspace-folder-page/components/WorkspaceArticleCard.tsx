import { Bookmark, List } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";
import { cn } from "../../../lib/utils";

export interface Article {
  _id: string;
  title: string;
  tags: Tag[];
  isVerified: boolean;
  status: "approved" | "rejected" | "pending";
  marker?: "red" | "yellow" | "green" | "blue" | "none";
  responseVariantsCount: number;
  createdAt: string;
}

interface Tag {
  _id: string;
  name: string;
}

interface WorkspaceArticleCardProps {
  folderId: string;
  workspaceId: string;
  article: Article;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Premium, stonowane kolory dla markerów
const markerStyles: Record<NonNullable<Article["marker"]>, { icon: string; bg: string }> = {
  red: { icon: "text-red-400/80 dark:text-red-500/80", bg: "bg-red-400/10 dark:bg-red-500/20" },
  yellow: { icon: "text-yellow-400/80 dark:text-yellow-500/80", bg: "bg-yellow-400/10 dark:bg-yellow-500/20" },
  green: { icon: "text-green-400/80 dark:text-green-500/80", bg: "bg-green-400/10 dark:bg-green-500/20" },
  blue: { icon: "text-blue-400/80 dark:text-blue-500/80", bg: "bg-blue-400/10 dark:bg-blue-500/20" },
  none: { icon: "text-muted-foreground/60", bg: "bg-muted/25" },
};

const WorkspaceArticleCard = ({
  folderId,
  workspaceId,
  article,
  onMouseEnter,
  onMouseLeave,
}: WorkspaceArticleCardProps) => {
  const hasMarker = !!article.marker;

  return (
    <Link
      to={`/workspace/${workspaceId}/folders/${folderId}/articles/${article._id}`}
      state={{ from: location.pathname + location.search }}
      className={cn(
        "flex justify-between items-center px-5 py-3 text-sm transition-all hover:shadow-lg hover:bg-muted/20",
        "bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-md border-b last:border-0 first:rounded-t-xl last:rounded-b-xl",
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Left side */}
      <div className="flex items-center gap-4.5 min-w-0 overflow-hidden flex-grow">
        <div
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-lg border border-muted/30 shadow-sm",
            hasMarker ? markerStyles[article.marker!].bg : "bg-muted/25",
          )}
        >
          <Bookmark
            className={cn(
              "w-5 h-5 ",
              hasMarker ? markerStyles[article.marker!].icon : "text-muted-foreground/60 bg-muted/25",
            )}
          />
        </div>

        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold truncate text-card-foreground/90">{article.title}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {article.responseVariantsCount > 1 && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted/10 text-xs font-medium shadow-sm">
            <List className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{article.responseVariantsCount}</span>
          </div>
        )}
        {article.status === "pending" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/20 shadow">
                <svg
                  className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 4a1 1 0 011 1v3a1 1 0 11-2 0V7a1 1 0 011-1zm0 6a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-card text-foreground">
              Wymaga weryfikacji
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </Link>
  );
};

export default WorkspaceArticleCard;
