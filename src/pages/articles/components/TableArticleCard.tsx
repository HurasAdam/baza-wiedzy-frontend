import { Box, FileText, List, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";
import { cn } from "../../../lib/utils";

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
  createdAt: string;
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

const TableArticleCard = ({ article, openArticleDrawer, onMouseEnter, onMouseLeave }: TableArticleCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onMouseEnter={() => onMouseEnter?.()}
      onMouseLeave={() => onMouseLeave?.()}
      key={article._id}
      onClick={() => navigate(`/articles/${article._id}`, { state: { from: location.pathname + location.search } })}
      className={cn(
        "flex justify-between items-center px-3.5 py-3 text-sm group cursor-pointer transition-all duration-300 rounded-lg",
        "border-b last:border-0 border-border/95",
        "bg-card/70 hover:bg-card/50 backdrop-blur-md gap-3",
      )}
      title={`Autor: ${article.createdBy.name}`}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0 overflow-hidden flex-grow">
        {/* ICON */}
        <div className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-muted/40 bg-muted/60 transition-transform duration-200 group-hover:scale-105">
          {article.isImportant ? (
            <Star className="w-4.5 h-4.5 text-yellow-500/90" />
          ) : (
            <FileText className="w-4.5 h-4.5 text-muted-foreground" />
          )}
        </div>

        {/* TEXT */}
        <div className="flex flex-col overflow-hidden min-w-0 gap-[5px]">
          {/* TITLE */}
          <span className="font-semibold text-[14.5px] text-card-foreground/90 group-hover:text-primary/95 transition-colors duration-200 line-clamp-2">
            {article.title}
          </span>

          {/* CATEGORY + TAGS w jednej linii */}
          <div className="flex items-center gap-1.5 flex-wrap overflow-hidden mt-[3.5px] ">
            {/* Kategoria – wyróżniona kolorem produktu */}
            <span
              className="px-2 py-[1px] rounded-md font-semibold uppercase tracking-wide text-[10px]"
              style={{
                backgroundColor: `${article.product.labelColor}20`,
                color: `${article.product.labelColor}E6`,
              }}
            >
              {article.category.name}
            </span>

            {/* TAGI */}
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag._id}
                className="text-foreground/75 text-[10px] bg-muted/30 px-1.5 py-[1px] rounded-full transition-all duration-200 hover:scale-110 hover:bg-muted/50"
              >
                {tag.name}
              </span>
            ))}

            {/* +N tooltip */}
            {article.tags.length > 3 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground/50 cursor-pointer text-[10px]">
                    +{article.tags.length - 3}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="p-2 rounded-md text-xs max-w-xs ">
                  {article.tags
                    .slice(3)
                    .map((t) => t.name)
                    .join(", ")}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center w-[220px] justify-between flex-shrink-0 gap-12">
        {/* PRODUCT BADGE */}
        <span
          className="inline-flex items-center gap-1.5 pr-2 px-1 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide max-w-[140px] truncate backdrop-blur-sm"
          style={{
            backgroundColor: `${article.product.labelColor}14`,
            color: `${article.product.labelColor}E6`,
            border: `1px solid ${article.product.labelColor}26`,
          }}
        >
          <Box className="w-3 h-3 opacity-50" />
          <span className="truncate">{article.product.name}</span>
        </span>

        <div className=" flex justify-center ">
          {/* VARIANTS */}
          {article.responseVariantsCount > 1 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted/10 border border-muted/30 shadow-sm transition-transform duration-200 hover:scale-105">
                  <List className="w-3 h-3" />
                  {article.responseVariantsCount}
                </div>
              </TooltipTrigger>
              <TooltipContent className="p-2 rounded-md text-xs" side="top">
                ilość wariantów odpowiedzi
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="opacity-0 pointer-events-none px-2 py-1 text-xs">
              <List className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableArticleCard;
