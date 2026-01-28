import type { AxiosError } from "axios";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useFindOneArticleUserFlagQuery } from "../../../hooks/article-user-flag/use-article-user-flag";
import { useFindOneArchivizedArticle } from "../../../hooks/articles/use-articles";
import { useAuthQuery } from "../../../hooks/auth/use-auth";
import { ArticleMainPageSkeleton } from "../../articlev2/ArticleMainPage/ArticleMainPageSkeleton";

export default function ArchivedArticleLayout() {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading, error, refetch, isRefetching } = useFindOneArchivizedArticle(id!);
  const { data: articleUserFlag } = useFindOneArticleUserFlagQuery(id || null);
  const { data: user } = useAuthQuery();
  const navigate = useNavigate();
  const userPermissions = user?.role?.permissions || [];

  // --- ERROR HANDLING ---
  if (error) {
    const status = (error as AxiosError).status;

    if (status === 400) {
      navigate("/bad-request", { replace: true });
      return null;
    }

    if (status === 404) {
      navigate("/not-found", { replace: true });
      return null;
    }

    if (status >= 500) {
      navigate("/server-error", { replace: true });
      return null;
    }

    // inne błędy
    navigate("/bad-request", { replace: true });
    return null;
  }
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-2">
        <ArticleMainPageSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-0.5 space-y-6 pb-10">
      <Outlet
        context={{
          article,
          articleUserFlag,
          refetch,
          isArticleRefreshing: isRefetching,
          userPermissions,
        }}
      />
    </div>
  );
}
