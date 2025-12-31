import type { AxiosError } from "axios";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useFindOneArticleUserFlagQuery } from "../../hooks/article-user-flag/use-article-user-flag";
import { useFindArticleQuery } from "../../hooks/articles/use-articles";
import { useAuthQuery } from "../../hooks/auth/use-auth";

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
      <div className="space-y-4 animate-pulse">
        {/* Skeleton header */}
        <div className="flex justify-between items-center py-4 px-2 bg-background border-b border-border">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-muted-foreground/20 rounded"></div>
              <div className="h-8 w-40 bg-muted-foreground/20 rounded"></div>
            </div>
            <div className="h-6 w-2/3 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>

        {/* Skeleton status badges */}
        <div className="flex flex-wrap gap-2 px-2">
          <div className="h-6 w-24 bg-muted-foreground/20 rounded-full"></div>
          <div className="h-6 w-32 bg-muted-foreground/20 rounded-full"></div>
          <div className="h-6 w-16 bg-muted-foreground/20 rounded-full"></div>
        </div>

        {/* Skeleton product/category/tag badges */}
        <div className="flex flex-wrap gap-2 px-2 mt-2">
          <div className="h-5 w-28 bg-muted-foreground/10 rounded-full"></div>
          <div className="h-5 w-24 bg-muted-foreground/10 rounded-full"></div>
          <div className="h-5 w-20 bg-muted-foreground/10 rounded-full"></div>
        </div>

        {/* Skeleton employee description */}
        <div className="px-2">
          <div className="h-5 w-48 bg-muted-foreground/20 rounded mb-2"></div>
          <div className="h-32 bg-muted-foreground/10 rounded"></div>
        </div>

        {/* Skeleton odpowiedzi */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 px-2">
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-4 bg-card space-y-2">
                <div className="h-4 w-32 bg-muted-foreground/20 rounded"></div>
                <div className="h-4 w-16 bg-muted-foreground/20 rounded"></div>
                <div className="h-[360px] bg-muted-foreground/10 rounded mt-2"></div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className=" max-w-[1400px] px-6 lg:px-0   mx-auto">
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
