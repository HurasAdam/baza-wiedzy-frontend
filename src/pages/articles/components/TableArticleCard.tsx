import { FileText, HeartIcon, Loader } from "lucide-react";
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

interface TableArticleCardProps {
  article: Article;
  toggleFavourite: (id: string) => void;
  toggleFavouriteLoading: boolean;
}

const TableArticleCard = ({
  article,

  toggleFavourite,
  toggleFavouriteLoading,
}: TableArticleCardProps) => {
  return (
    <Link
      to={`/articles/${article._id}`}
      state={{ from: location.pathname + location.search }} // 👈 tu zapisujemy query string
    >
      <div
        key={article._id}
        className="flex justify-between items-center px-4 py-3 text-sm hover:bg-muted transition-colors cursor-pointer "
        title={`Autor: ${article.createdBy.name}`}
      >
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          <div className="relative flex-shrink-0">
            {article.responseVariantsCount > 1 ? (
              <FileText className="w-5 h-5 text-muted-foreground" />
            ) : (
              <FileText className="w-5 h-5 text-muted-foreground" />
            )}

            {article.responseVariantsCount > 1 && (
              <span className="absolute -top-1 -right-1.5 flex items-center justify-center w-4 h-4 text-[9px] font-medium text-white bg-primary/90 shadow-sm rounded-full">
                {article.responseVariantsCount}
              </span>
            )}
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="font-medium text-foreground truncate">{article.title}</span>
            <span className="text-muted-foreground text-xs">{article.product.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-40">
          {/* Wersje odpowiedzi */}
          {article.status === "pending" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-6 h-6 cursor-default ">
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

          {/* Ulubione */}
          <Button
            className="cursor-pointer hover:bg-background"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
      </div>
    </Link>
  );
};

export default TableArticleCard;
