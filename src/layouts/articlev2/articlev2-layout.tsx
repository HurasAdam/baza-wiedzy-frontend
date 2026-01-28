import type { AxiosError } from "axios";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useFindOneArticleUserFlagQuery } from "../../hooks/article-user-flag/use-article-user-flag";
import { useFindArticleQuery } from "../../hooks/articles/use-articles";
import { useAuthQuery } from "../../hooks/auth/use-auth";
import { ArticleMainPageSkeleton } from "../../pages/articlev2/ArticleMainPage/ArticleMainPageSkeleton";

export default function Articlev2Layout() {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading, error, refetch, isRefetching } = useFindArticleQuery(id!);
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
      <div className="max-w-[1320px] mx-auto">
        <ArticleMainPageSkeleton />
      </div>
    );
  }

  return (
    <div className=" max-w-[1320px] px-6 lg:px-0   mx-auto">
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
