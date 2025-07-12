import { useFindArticlesQuery } from "../../hooks/articles/use-articles";

export const ArticlesPage = () => {
  const { data: articles } = useFindArticlesQuery();

  return <div>ArticlesPage</div>;
};
