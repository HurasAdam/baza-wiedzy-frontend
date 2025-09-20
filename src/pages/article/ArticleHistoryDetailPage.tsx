// ArticleHistoryDetailPage.tsx
import { ArrowLeft, ArrowUp, Loader, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useFindArticleHistoryItemDetailsQuery } from "../../hooks/articles-history/use-articles-history";
import { ArticleHistoryDetailsCreated } from "./components/ArticleHistoryDetailsCreated";
import { ArticleHistoryDetailsUpdated } from "./components/ArticleHistoryDetailsUpdated";
import { ArticleHistoryDetailsVerified } from "./components/ArticleHistoryDetailsVerified";

export const ArticleHistoryDetailPage = () => {
  const { id: articleId, historyId } = useParams<{ id: string; historyId: string }>();
  const { data, isFetching: isRefetching, refetch } = useFindArticleHistoryItemDetailsQuery(historyId!);

  if (!data) return <div>Ładowanie...</div>;

  const item = Array.isArray(data) ? data[0] : data;

  return (
    <div className="space-y-3.5">
      {/* --- Nagłówek ---*/}
      <HistoryHeader articleId={articleId!} onRefresh={() => refetch()} isRefetching={isRefetching} />

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
  onRefresh?: () => void;
  isRefetching: boolean;
}

export const HistoryHeader = ({ articleId, onRefresh, isRefetching }: HistoryHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-md shadow-md space-x-2 bg-background border-b border-border">
      <div className="flex items-center space-x-2">
        {/* Wstecz */}
        <Button variant="ghost" onClick={() => navigate(-1)} className=" transition" title="Cofnij">
          <ArrowLeft className="w-5 h-5" /> Wstecz
        </Button>

        {/* Wróć do artykułu */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/articles/${articleId}`)}
          className=" transition"
          title="Wróć do artykułu"
        >
          <ArrowUp className="w-5 h-5" /> Wróć do artykułu
        </Button>
      </div>

      {/* Odśwież */}
      <div className="flex items-center space-x-2">
        <Button onClick={onRefresh} variant="ghost" className="p-2 rounded transition" title="Odśwież">
          {isRefetching ? <Loader className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};
