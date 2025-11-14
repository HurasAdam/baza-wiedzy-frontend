import { Card, CardContent } from "@/components/ui/card";
import { Copy, FolderOpenDot, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFindWorkspaceArticleQuery } from "../../hooks/workspace-articles/use-workspace-articles";

export function WorkspaceArticlePage() {
  const { articleId } = useParams();
  const { data: article, isLoading } = useFindWorkspaceArticleQuery(articleId!);

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
    <div className="mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground/90">{article.title}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <FolderOpenDot className="w-4 h-4 text-amber-400/45 " />
            <span className="font-medium">{article.folder.name}</span>
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <User className="w-4 h-4 text-muted-foreground/70" />
            <span>
              {article.createdBy.name} {article.createdBy.surname}
            </span>
            <span className="mx-1">•</span>
            <span>{new Date(article.createdAt).toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Variants content */}
      <div
        className={`grid gap-4 ${article.responseVariants.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}
      >
        {article.responseVariants.map((variant) => (
          <Card key={variant._id} className="shadow-sm border hover:shadow-md transition bg-muted/35">
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">{variant.variantName}</h3>
                {variant.variantContent && (
                  <Copy
                    onClick={() => copyToClipboard(variant.variantContent)}
                    className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary"
                  />
                )}
              </div>
              <div className="border-t border-muted my-2"></div>
              <p className="text-[15.5px] whitespace-pre-wrap text-muted-foreground">{variant.variantContent}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
