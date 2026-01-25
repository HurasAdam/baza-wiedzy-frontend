import { NoDataFound } from "../../../components/shared/NoDataFound";
import SkeletonArticleCard from "../../pending-articles/components/SkeletonArticleCard";
import TableArticleCard from "./TableArticleCard";

interface Tag {
  _id: string;
  name: string;
}

export interface ArticleAuthor {
  _id: string;
  name: string;
  surname: string;
}

export interface Product {
  _id: string;
  name: string;
  labelColor: string;
  banner?: string;
}

export interface Category {
  _id: string;
  name: string;
}
export interface Article {
  _id: string;
  title: string;
  tags: Tag[];
  isVerified: boolean;
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
  responseVariantsCount: number;
}

export interface ArticlesResponse {
  data: Article[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

interface ArticlesListProps {
  articles: ArticlesResponse;
  isLoading: boolean;
  isError: boolean;
  onResetAllFilters: () => void;
  toggleFavourite: (id: string) => void;
  pendingId: string | null;
  selectedTitle?: string;
  selectedProduct?: string;
  selectedCategory?: string;
  openArticleDrawer: (articleId: string) => void;
  setHoveredArticleId: (id: string | null) => void;
  setHoveredArticleIdRef: (id: string | null) => void;
}
const ArticlesList = ({
  articles,
  isLoading,
  isError,
  onResetAllFilters,
  toggleFavourite,
  pendingId,
  selectedTitle,
  selectedProduct,
  selectedCategory,
  openArticleDrawer,
  setHoveredArticleId,
  setHoveredArticleIdRef,
}: ArticlesListProps) => {
  return (
    <div className="flex-grow flex flex-col h-fit divide-y divide-border rounded-xl  ">
      {isLoading && (
        <ul className="divide-y divide-border ">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <SkeletonArticleCard key={i} withSpinner={i === 0} />
            ))}
        </ul>
      )}

      {isError && <p className="text-sm text-destructive">Błąd podczas ładowania artykułów.</p>}

      {!isLoading &&
        !isError &&
        articles?.data.length === 0 &&
        (selectedTitle || selectedProduct || selectedCategory) && (
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
          <TableArticleCard
            onMouseEnter={() => setHoveredArticleIdRef(article._id)}
            onMouseLeave={() => setHoveredArticleIdRef(null)}
            key={article._id}
            article={article}
            toggleFavourite={toggleFavourite}
            toggleFavouriteLoading={pendingId === article._id}
            openArticleDrawer={openArticleDrawer}
          />
        ))}
    </div>
  );
};

export default ArticlesList;
