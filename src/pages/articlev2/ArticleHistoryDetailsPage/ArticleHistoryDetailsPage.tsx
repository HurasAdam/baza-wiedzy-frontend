// ArticleHistoryDetailPage.tsx
import { useOutletContext, useParams } from "react-router-dom";
import { useFindArticleHistoryItemDetailsQuery } from "../../../hooks/articles-history/use-articles-history";
import type { ArticleOutletContext } from "../../article/ArticleMainPage";

import { ArticleDetailsApproved } from "./components/ArticleDetailsApproved";
import { ArticeDetailsCreated } from "./components/ArticleDetailsCreated";

import { ArticleDetailsExpired } from "./components/ArticleDetailsExpired";
import { ArticleDetailsUpdated } from "./components/ArticleDetailsUpdated";
import { HistoryHeader } from "./components/HistoryHeader";

export const Articlev2HistoryDetailPage = () => {
  const { id: articleId, historyId } = useParams<{ id: string; historyId: string }>();
  const { article } = useOutletContext<ArticleOutletContext>();
  const { data, isFetching: isRefetching, refetch } = useFindArticleHistoryItemDetailsQuery(historyId!);

  if (!data) return <div>Ładowanie...</div>;

  const item = Array.isArray(data) ? data[0] : data;

  return (
    <div className="space-y-3.5 max-w-[1400px]">
      <HistoryHeader article={article} onRefresh={() => refetch()} isRefetching={isRefetching} />

      {(() => {
        switch (item.eventType) {
          case "created": {
            const snapshot = item.changes?.[0]?.newValue;
            if (!snapshot) return <div>Brak danych snapshotu</div>;
            return <ArticeDetailsCreated snapshot={snapshot} />;
          }
          case "updated": {
            return <ArticleDetailsUpdated changes={item.changes} />;
          }
          case "verified": {
            return (
              <ArticleDetailsApproved verifiedBy={item.createdBy} verifiedAt={item.updatedAt} changes={item.changes} />
            );
          }

          case "expired": {
            return <ArticleDetailsExpired item={item} />;
          }
          default: {
            return <div>Nieobsługiwany typ eventu: {item.eventType}</div>;
          }
        }
      })()}
    </div>
  );
};
