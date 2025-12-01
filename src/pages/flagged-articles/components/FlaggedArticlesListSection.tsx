import { NoDataFound } from "../../../components/shared/NoDataFound";
import type { ArticleAuthor, Category, Product } from "../../articles/components/ArticlesList";
import SkeletonArticleCard from "../../pending-articles/components/SkeletonArticleCard";
import { TableFlaggedArticleCard } from "./TableFlaggedArticleCard";

export interface Flag {
  _id: string;
  name: string;
  color: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FlaggedArticle {
  _id: string;
  title: string;

  status: string;
  rejectionReason: string | null; // zmiana tu
  rejectedBy?: string | null;
  createdBy: ArticleAuthor;
  viewsCounter: number; // zmiana tu
  isTrashed: boolean; // zmiana tu
  product: Product;
  category: Category;
  createdAt: string;
  isFavourite: boolean;
  flag: { _id: string; name: string; color: string };
  responseVariantsCount: number;
}

export interface FlaggedArticleResponse {
  data: FlaggedArticle[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

interface FlaggedArticlesListSectionProps {
  isLoading: boolean;
  isError: boolean;
  articles: FlaggedArticleResponse;
  onResetAllFilters: () => void;
  handleFlagChange: (articleId: string, flagId: string) => void;
  toggleFavourite: (articleId: string) => void;
  titleParam: string;
  selectedProduct: string;
  selectedCategory: string;
  pendingId: string | null;
  userFlags: Flag[];
}

const FlaggedArticlesListSection = ({
  isLoading,
  isError,
  articles,
  onResetAllFilters,
  titleParam,
  selectedProduct,
  selectedCategory,
  userFlags,
  handleFlagChange,
  toggleFavourite,
  pendingId,
}: FlaggedArticlesListSectionProps) => {
  return (
    <div className="flex-grow flex flex-col h-fit  divide-y divide-border rounded-xl bg-card/90">
      {isLoading && (
        <ul className="divide-y divide-border py-2">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <SkeletonArticleCard key={i} withSpinner={i === 0} />
            ))}
        </ul>
      )}

      {isError && <p className="text-sm text-destructive">Błąd podczas ładowania artykułów.</p>}

      {!isLoading && !isError && articles?.data.length === 0 && (titleParam || selectedProduct || selectedCategory) && (
        <NoDataFound
          title="Nie znaleziono żadnych artykułów"
          description="Spróbuj zmienić filtry lub zresetuj wszystkie."
          buttonText="Wyczyść filtry"
          buttonAction={onResetAllFilters}
        />
      )}

      {!isError &&
        articles?.data.length > 0 &&
        articles.data.map((article) => (
          <TableFlaggedArticleCard
            key={article._id}
            article={article}
            onFlagChange={handleFlagChange}
            toggleFavourite={toggleFavourite}
            toggleFavouriteLoading={pendingId === article._id}
          />
        ))}
    </div>
  );
};

export default FlaggedArticlesListSection;
