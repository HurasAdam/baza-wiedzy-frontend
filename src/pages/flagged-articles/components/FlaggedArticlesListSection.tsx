import { useState } from "react";
import { toast } from "sonner";
import { EditFlagArticleModal, type FlaggedArticleForModal } from "../../../components/flag/edit-flag-article-modal";
import { Alert } from "../../../components/shared/alert-modal";
import { NoDataFound } from "../../../components/shared/NoDataFound";
import queryClient from "../../../config/query.client";
import { useUnflagArticleUserFlagMutation } from "../../../hooks/article-user-flag/use-article-user-flag";
import type { ArticleAuthor, Category, Product } from "../../articles/components/ArticlesList";
import SkeletonArticleCard from "../../pending-articles/components/SkeletonArticleCard";
import { TableFlaggedArticleCard } from "./TableFlaggedArticleCard";

export interface Flag {
  _id: string;
  name: string;
  color: string;
}

export interface FlaggedArticle {
  _id: string;
  title: string;
  status: string;
  rejectionReason: string | null;
  rejectedBy?: string | null;
  createdBy: ArticleAuthor;
  viewsCounter: number;
  isTrashed: boolean;
  product: Product;
  category: Category;
  createdAt: string;
  isFavourite: boolean;
  flag: { _id: string; name: string; color: string };
  responseVariantsCount: number;
}

type FlaggedArticleWithSelected = FlaggedArticle & {
  selectedFlag: Flag | null;
};

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
  toggleFavourite,
  pendingId,
}: FlaggedArticlesListSectionProps) => {
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isUnflagModalOpen, setIsUnflagModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<FlaggedArticleForModal | null>(null);
  const { mutate: unflagMutate, isPending: isUnflagArticlePending } = useUnflagArticleUserFlagMutation();
  const openFlagModal = (article: FlaggedArticleForModal) => {
    const articleForModal: FlaggedArticleForModal = {
      ...article,
      selectedFlag: article.flag ? { _id: article.flag._id, name: article.flag.name, color: article.flag.color } : null,
    };

    setSelectedArticle(articleForModal);
    setIsFlagModalOpen(true);
  };

  const onUnflag = (article: FlaggedArticleForModal) => {
    setSelectedArticle(article);
    setIsUnflagModalOpen(true);
  };

  const onUnflageCancel = () => {
    setSelectedArticle(null);
    setIsUnflagModalOpen(false);
  };

  const onUnflagConfirm = (articleId: string) => {
    unflagMutate(articleId, {
      onSuccess: () => {
        toast.success("Usunięto z ulubionych", {
          position: "bottom-right",
          description: "Artykuł został usunięty z listy ulubionych.",
        });
        setSelectedArticle(null);
        setIsUnflagModalOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["my-flagged-articles"],
        });
      },
    });
  };

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

      {!isLoading &&
        !isError &&
        articles?.data.length === 0 &&
        !(titleParam || selectedProduct || selectedCategory) && (
          <NoDataFound
            title="Brak oznaczonych artykułów"
            description="Nie masz jeszcze żadnych artykułów z przypisaną etykietą."
          />
        )}

      {!isError &&
        articles?.data.length > 0 &&
        articles.data.map((article) => (
          <TableFlaggedArticleCard
            key={article._id}
            article={article}
            toggleFavourite={toggleFavourite}
            toggleFavouriteLoading={pendingId === article._id}
            openFlagModal={openFlagModal}
            onUnflag={onUnflag}
          />
        ))}

      {selectedArticle && (
        <EditFlagArticleModal
          isOpen={isFlagModalOpen}
          setIsOpen={setIsFlagModalOpen}
          article={selectedArticle}
          articleUserFlag={{
            selectedFlag: selectedArticle.selectedFlag ?? null,
          }}
        />
      )}

      {selectedArticle && (
        <Alert
          isOpen={isUnflagModalOpen}
          title="Usuń artykuł z ulubionych"
          onCancel={onUnflageCancel}
          onConfirm={() => onUnflagConfirm(selectedArticle._id)}
          isLoading={isUnflagArticlePending}
          type="warning"
        >
          <div className="space-y-2">
            <p>
              Artykuł <strong>{selectedArticle.title}</strong> zostanie usunięty z listy ulubionych.
            </p>
            <p className="text-sm text-muted-foreground">
              Artykuł pozostanie dostępny w systemie i w każdej chwili możesz ponownie dodać go do ulubionych.
            </p>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default FlaggedArticlesListSection;
