import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import type { Article } from "../../../../types/article";

interface Props {
  article: Article;
}

export const ArticleEditHeader = ({ article }: Props) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center gap-4 border-b border-border pb-4 mb-4 ">
      <Button
        variant="outline"
        className=" w-16 h-16 hover:bg-muted/30 flex  items-center justify-center rounded-lg bg-background"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-8 h-8" />
      </Button>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold max-w-[740px] break-words text-foreground/95">Edycja artykułu</h1>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate max-w-[520px]">{article?.title ?? "Ładowanie..."}</span>
          {article?.product?.name && (
            <>
              • <span>Produkt: {article.product.name}</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
