// ArticleHistoryDetailPage.tsx
import { ArrowLeft, Loader, RefreshCw } from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useFindArticleHistoryItemDetailsQuery } from "../../hooks/articles-history/use-articles-history";
import type { ArticleOutletContext } from "./ArticleMainPage";
import { ArticleHistoryDetailsCreated } from "./components/ArticleHistoryDetailsCreated";
import { ArticleHistoryDetailsUpdated } from "./components/ArticleHistoryDetailsUpdated";
import { ArticleHistoryDetailsVerified } from "./components/ArticleHistoryDetailsVerified";

export const ArticleHistoryDetailPage = () => {
  const { id: articleId, historyId } = useParams<{ id: string; historyId: string }>();
  const { article } = useOutletContext<ArticleOutletContext>();
  const { data, isFetching: isRefetching, refetch } = useFindArticleHistoryItemDetailsQuery(historyId!);

  if (!data) return <div>Ładowanie...</div>;

  const item = Array.isArray(data) ? data[0] : data;

  return (
    <div className="space-y-3.5 max-w-[1400px]">
      {/* --- Nagłówek ---*/}
      <HistoryHeader articleId={articleId!} article={article} onRefresh={() => refetch()} isRefetching={isRefetching} />

      {(() => {
        switch (item.eventType) {
          case "created": {
            const snapshot = item.changes?.[0]?.newValue;
            if (!snapshot) return <div>Brak danych snapshotu</div>;
            return <ArticleHistoryDetailsCreated snapshot={snapshot} />;
          }
          case "updated": {
            return <ArticleHistoryDetailsUpdated changes={item.changes} />;
          }
          case "verified": {
            return (
              <ArticleHistoryDetailsVerified
                verifiedBy={item.createdBy}
                verifiedAt={item.updatedAt}
                changes={item.changes}
              />
            );
          }
          default: {
            return <div>Nieobsługiwany typ eventu: {item.eventType}</div>;
          }
        }
      })()}
    </div>
  );
};

interface HistoryHeaderProps {
  articleId: string;
  article: {
    title: string;
    product: {
      name: string;
      labelColor: string;
    };
    category: {
      name: string;
    };
  };
  onRefresh?: () => void;
  isRefetching: boolean;
}

interface HistoryHeaderProps {
  articleId: string;
  article: {
    title: string;
    product: {
      name: string;
    };
    category: {
      name: string;
    };
  };
  onRefresh?: () => void;
  isRefetching: boolean;
}

export const HistoryHeader = ({ articleId, article, onRefresh, isRefetching }: HistoryHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
      {/* LEWA STRONA */}
      <div className="flex items-center gap-4 min-w-0">
        <Button
          variant="outline"
          className="w-16 h-16 hover:bg-muted/30 flex items-center justify-center rounded-lg bg-background"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-8 h-8" />
        </Button>

        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-xl font-semibold max-w-[840px] break-words">{article.title}</h1>

          <p className="text-sm text-muted-foreground">
            {article.product.name} • {article.category.name}
          </p>
        </div>
      </div>

      {/* PRAWA STRONA */}
      <Button
        onClick={onRefresh}
        variant="outline"
        className="p-3 rounded transition mr-2 flex items-center gap-2"
        title="Odśwież"
      >
        {isRefetching ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        Odśwież
      </Button>
    </div>
  );
};

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const IconButton = ({ icon, label, onClick }: IconButtonProps) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className="
      inline-flex h-8 w-8 items-center justify-center
      rounded-md
      text-muted-foreground
      hover:bg-muted hover:text-foreground
      transition
    "
  >
    {icon}
  </button>
);
