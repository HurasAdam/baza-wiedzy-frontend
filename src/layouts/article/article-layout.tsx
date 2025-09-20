import { Loader } from "lucide-react";
import { Outlet, useMatch, useParams } from "react-router-dom";
import { useFindArticleQuery } from "../../hooks/articles/use-articles";
import { ArticlePageHeader } from "../../pages/article/components/ArticlePageHeader";

export default function ArticleLayout() {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading, refetch, isRefetching } = useFindArticleQuery(id!);

  const matchHistoryDetail = useMatch("/articles/:id/history/:historyId");
  const showHeader = !matchHistoryDetail; // nagłówek NIE pokaże się w szczegółach historii

  if (isLoading) {
    return <Loader className="animate-spin" />;
  }

  return (
    <div className="space-y-1">
      {article && showHeader && <ArticlePageHeader article={article} returnUrl="/articles" />}
      <Outlet
        context={{
          article,
          refetch,
          isArticleRefreshing: isRefetching,
        }}
      />
    </div>
  );
}
