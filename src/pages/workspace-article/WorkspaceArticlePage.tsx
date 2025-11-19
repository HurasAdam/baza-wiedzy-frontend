import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFindWorkspaceArticleQuery } from "../../hooks/workspace-articles/use-workspace-articles";
import ArticleHeader from "./components/ArticleHeader";
import { ArticleVariants } from "./components/ArticleVariants";

export function WorkspaceArticlePage() {
  const { articleId } = useParams();
  const { data: article, isLoading } = useFindWorkspaceArticleQuery(articleId!);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="animate-spin w-8 h-8 block rounded-full border-4 border-gray-300 border-t-primary"></span>
      </div>
    );
  }

  if (!article) {
    return <p className="text-center mt-10">Nie znaleziono artykułu</p>;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Odpowiedź skopiowana do schowka", { position: "bottom-right" });
  };

  return (
    <div className="mx-auto px-6 py-1 space-y-6">
      <ArticleHeader
        title={article.title}
        folderName={article.folder.name}
        createdBy={article.createdBy}
        createdAt={article.createdAt}
        onBack={() => navigate(-1)}
      />

      <ArticleVariants articleId={article._id} variants={article.responseVariants} onCopy={copyToClipboard} />
    </div>
  );
}
