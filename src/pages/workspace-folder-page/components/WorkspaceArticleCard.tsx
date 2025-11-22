import { FileText, HeartIcon, Loader } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";
import { cn } from "../../../lib/utils";

const statusLabels: Record<string, string> = {
  approved: "Zatwierdzony",
  pending: "Oczekujący",
  rejected: "Odrzucony",
};

export interface Article {
  _id: string;
  title: string;
  tags: Tag[];
  isVerified: boolean;
  status: "approved" | "rejected" | "pending";
  rejectionReason: string | null;
  rejectedBy: string | null;
  createdBy: Author;
  viewsCounter: number;
  responseVariantsCount: number;
  isTrashed: boolean;
  product: Product;
  category: Category;
  createdAt: string; // ISO date string
  isFavourite: boolean;
}

interface Tag {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  surname: string;
}

interface Product {
  _id: string;
  name: string;
  labelColor: string;
  banner: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Flag {
  _id: string;
  name: string;
  labelColor: string;
}

interface TableArticleCardProps {
  folderId: string;
  workspaceId: string;
  article: Article;
  flags: Flag[];
  onFlagChange: (articleId: string, flagId: string) => void;
  toggleFavourite: (id: string) => void;
  toggleFavouriteLoading: boolean;
  openArticleDrawer: (articleId: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const WorkspaceArticleCard = ({
  folderId,
  workspaceId,
  article,
  flags,
  onFlagChange,
  toggleFavourite,
  toggleFavouriteLoading,
  openArticleDrawer,
  onMouseEnter,
  onMouseLeave,
}: TableArticleCardProps) => {
  const [selectedFlag, setSelectedFlag] = useState<string | undefined>();

  const handleFlagSelect = (flagId: string) => {
    setSelectedFlag(flagId);
    onFlagChange(article._id, flagId);
  };

  const selectedFlagColor = selectedFlag ? flags.find((f) => f._id === selectedFlag)?.labelColor : "#999";

  return (
    <Link
      to={`/workspace/${workspaceId}/folders/${folderId}/articles/${article._id}`}
      state={{ from: location.pathname + location.search }}
      className={cn(
        "flex justify-between items-center px-4 py-2 text-sm hover:bg-muted transition-colors bg-muted/15",
        "border-b last:border-0",
        "first:rounded-t-xl",
        "last:rounded-b-lg"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Left side */}
      <div className="flex items-center gap-3 min-w-0 overflow-hidden flex-grow">
        <div className="relative flex-shrink-0">
          <FileText className="w-5 h-5 text-muted-foreground" />
          {article.responseVariantsCount > 1 && (
            <span className="absolute -top-1 -right-1.5 flex items-center justify-center w-4 h-4 text-[9px] font-medium text-white bg-primary/90 shadow-sm rounded-full">
              {article.responseVariantsCount}
            </span>
          )}
        </div>

        <div className="flex flex-col overflow-hidden">
          <span className="font-medium text-muted-foreground truncate">{article.title}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {article.status === "pending" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center justify-center w-6 h-6 cursor-default"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <svg
                  className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 4a1 1 0 011 1v3a1 1 0 11-2 0V7a1 1 0 011-1zm0 6a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-muted" side="top">
              Wymaga weryfikacji
            </TooltipContent>
          </Tooltip>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleFavourite(article._id);
          }}
        >
          {toggleFavouriteLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <HeartIcon
              className={cn(
                "h-4 w-4",
                article.isFavourite ? "text-primary/65 fill-primary/65" : "text-muted-foreground"
              )}
            />
          )}
        </Button>
      </div>
    </Link>
  );
};

export default WorkspaceArticleCard;
