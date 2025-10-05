import { Box, FileTextIcon, Loader, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";

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

interface FavoriteArticleCardProps {
  article: Article;
  toggleFavourite: (id: string) => void;
  toggleFavouriteLoading: boolean;
}

const FavoriteArticleCard = ({ article, toggleFavourite, toggleFavouriteLoading }: FavoriteArticleCardProps) => {
  return (
    <Link to={`/articles/${article._id}`}>
      <div
        key={article._id}
        className="flex justify-between items-center bg-card   px-4 py-3 text-sm hover:bg-muted transition-colors cursor-pointer"
        title={`Autor: ${article.createdBy.name}`}
      >
        {/* LEWA STRONA: ikona Box + tytuł */}
        <div className="flex items-center gap-3 overflow-hidden min-w-0">
          <Box className="w-5 h-5 flex-shrink-0" style={{ color: article.product.labelColor }} />
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium text-foreground truncate">{article.title}</span>
            <span className="text-muted-foreground text-xs">{article.product.name}</span>
          </div>
        </div>

        {/* PRAWA STRONA: liczba wersji + przycisk ulubione */}
        <div className="flex items-center gap-4">
          {article.responseVariantsCount > 1 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <FileTextIcon className="w-4 h-4" />
                  <span>{article.responseVariantsCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">Liczba wersji odpowiedzi w tym artykule</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="hover:text-destructive cursor-pointer"
                variant="ghost"
                size="icon"
                aria-label="Usuń z ulubionych"
                disabled={toggleFavouriteLoading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavourite(article._id);
                }}
              >
                {toggleFavouriteLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2Icon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Usuń z ulubionych</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </Link>
  );
};

export default FavoriteArticleCard;
