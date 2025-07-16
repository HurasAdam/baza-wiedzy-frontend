import { HeartIcon, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
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
    <Link to={`/articles/${article._id}`}>
      <div
        key={article._id}
        className="flex justify-between items-center px-4 py-3 text-sm hover:bg-muted transition-colors cursor-pointer"
        title={`Autor: ${article.createdBy.name}`}
      >
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium text-foreground truncate">
            {article.title}
          </span>
          <span className="text-muted-foreground text-xs">
            {article.product.name}
          </span>
        </div>

        <Button
          className="cursor-pointer"
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
                article.isFavourite
                  ? "text-primary/65 fill-primary/65"
                  : "text-muted-foreground"
              )}
            />
          )}
        </Button>
      </div>
    </Link>
  );
};

export default TableArticleCard;
