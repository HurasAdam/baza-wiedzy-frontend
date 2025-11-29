import { FileText, HeartIcon, List, Loader, Star } from "lucide-react";
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
  article: Article;
  flags: Flag[];
  onFlagChange: (articleId: string, flagId: string) => void;
  toggleFavourite: (id: string) => void;
  toggleFavouriteLoading: boolean;
  openArticleDrawer: (articleId: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const TableArticleCard = ({
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

  return (
    <div
      onMouseEnter={() => onMouseEnter?.()}
      onMouseLeave={() => onMouseLeave?.()}
      key={article._id}
      className={cn(
        "flex justify-between items-center px-4 py-3 text-sm hover:bg-muted transition-colors bg-card/90",
        "border-b last:border-0 first:rounded-t-xl last:rounded-b-lg"
      )}
      title={`Autor: ${article.createdBy.name}`}
    >
      {/* LEFT SIDE: FileText / Status Icon + Title + Product */}
      <Link
        to={`/articles/${article._id}`}
        state={{ from: location.pathname + location.search }}
        className="flex items-center gap-3 min-w-0 overflow-hidden flex-grow"
      >
        <div className="relative flex-shrink-0 flex items-center justify-center p-2 rounded-full border border-muted/40 bg-muted/10">
          {article.status === "pending" ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Star className="w-4.5 h-4.5 text-primary/80" />
              </TooltipTrigger>
              <TooltipContent className="bg-muted p-2 rounded-md text-xs">Wymaga weryfikacji</TooltipContent>
            </Tooltip>
          ) : (
            <FileText className="w-4.5 h-4.5 text-muted-foreground" />
          )}
        </div>

        {/* Tytuł + Produkt */}
        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold text-foreground truncate">{article.title}</span>
          <span className="text-xs text-muted-foreground truncate">{article.product.name}</span>
        </div>
      </Link>

      {/* RIGHT SIDE: Response Variants, Meta Data, Favourite */}
      <div className="flex items-center gap-4">
        {/* Liczba wariantów */}
        {article.responseVariantsCount > 1 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted/10 border border-muted/30 shadow-sm">
                <List className="w-3 h-3" />
                {article.responseVariantsCount}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-muted p-2 rounded-md text-xs" side="top">
              ilość wariantów
            </TooltipContent>
          </Tooltip>
        )}

        {/* Meta dane: status + attachment */}
        <div className="flex items-center gap-2 w-4 h-4  rounded-md p-2.5 ">
          {article.status === "pending" ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-4 h-4">
                  <svg
                    className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 4a1 1 0 011 1v3a1 1 0 11-2 0V7a1 1 0 011-1zm0 6a1 1 0 110 2 1 1 0 010-2z" />
                  </svg>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-muted p-2 rounded-md text-xs" side="top">
                Wymaga weryfikacji
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="w-4 h-4"></div>
          )}
        </div>

        {/* Favourite */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-6"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(article._id);
          }}
        >
          {toggleFavouriteLoading ? (
            <Loader className="animate-spin w-5 h-5" />
          ) : (
            <HeartIcon
              className={cn(
                "w-5 h-5",
                article.isFavourite ? "text-primary/65 fill-primary/65" : "text-muted-foreground"
              )}
            />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TableArticleCard;
