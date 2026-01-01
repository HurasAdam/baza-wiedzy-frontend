import { FileText, HeartIcon, List, Loader, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  isImportant: boolean;
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
  const navigate = useNavigate();

  const handleFlagSelect = (flagId: string) => {
    setSelectedFlag(flagId);
    onFlagChange(article._id, flagId);
  };

  return (
    <div
      onMouseEnter={() => onMouseEnter?.()}
      onMouseLeave={() => onMouseLeave?.()}
      key={article._id}
      onClick={() => navigate(`/articles/v2/${article._id}`, { state: { from: location.pathname + location.search } })}
      className={cn(
        "flex justify-between items-center px-3.5 py-3 text-sm hover:bg-muted/45 transition-colors bg-card/60 ",
        "border-b last:border-0 first:rounded-t-xl last:rounded-b-lg"
      )}
      title={`Autor: ${article.createdBy.name}`}
    >
      {/* LEFT SIDE: FileText / Status Icon + Title + Product */}
      <div
        to={`/articles/v2/${article._id}`}
        state={{ from: location.pathname + location.search }}
        className="flex items-center gap-3 min-w-0 overflow-hidden flex-grow"
      >
        <div className="relative  flex-shrink-0 w-7.5 h-7.5 flex items-center justify-center  rounded-md border border-muted/40 bg-muted/70">
          {article.isImportant ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Star className="w-4 h-4 text-yellow-600/90 " />
              </TooltipTrigger>
              <TooltipContent className="bg-muted p-2 rounded-md text-xs">Wymaga weryfikacji</TooltipContent>
            </Tooltip>
          ) : (
            <FileText className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold text-foreground/95  break-words">{article.title}</span>

          <span
            className="inline-flex items-center px-2 py-[1px] mt-1 rounded-full text-[9px] font-medium uppercase tracking-wide w-fit"
            style={{
              backgroundColor: `${article.product.labelColor}1A`,
              color: article.product.labelColor,
              border: `1px solid ${article.product.labelColor}33`,
              opacity: 0.85,
            }}
          >
            {article.product.name}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: Response Variants, Meta Data, Favourite */}
      <div className="flex items-center gap-4">
        {/* Liczba wariantów */}
        {article.responseVariantsCount > 1 ? (
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
        ) : (
          <div className="opacity-0 pointer-events-none px-2 py-1 text-xs">
            <List className="w-3 h-3" />
          </div>
        )}

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
