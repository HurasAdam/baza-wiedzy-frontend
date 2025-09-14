// layouts/article/ArticleLayout.tsx
import { Loader } from "lucide-react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useFindArticleQuery } from "../../hooks/articles/use-articles";
import { ArticlePageHeader } from "../../pages/article/components/ArticlePageHeader";

export default function ArticleLayout() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { data: article, isLoading, isError, error } = useFindArticleQuery(id!);

  const returnUrl = (location.state as { from?: string })?.from ?? "/articles";
  if (isLoading) {
    return <Loader className="animate-spin" />;
  }
  return (
    <div className="space-y-1">
      {article && <ArticlePageHeader article={article} returnUrl={returnUrl} />}

      <Outlet context={article} />
    </div>
  );
}
