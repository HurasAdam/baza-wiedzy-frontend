import { Loader } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import type { ArticleListItem } from "../../../types/article";

const PendingArticleCard = ({
  className,
  article,
  onApprove,
  onReject,
  loading,
}: {
  className?: string;
  article: ArticleListItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}) => {
  return (
    <Card
      key={article._id}
      className="w-full transition-shadow hover:shadow-sm border border-border rounded-xl p-4 bg-card"
    >
      <CardContent className="p-0 flex flex-col gap-4">
        {/* Header z tytułem i przyciskami po prawej */}
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-base font-semibold text-card-foreground leading-snug break-words line-clamp-2">
            {article.title}
          </h2>

          <div className="flex gap-2 shrink-0">
            <Button
              className="cursor-pointer"
              onClick={() => onApprove(article._id)}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Zatwierdź"
              )}
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => onReject(article._id)}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              Odrzuć
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-muted-foreground flex flex-col gap-1">
          <div>
            <span className="font-medium text-foreground">Autor:</span>{" "}
            {article.createdBy?.name} {article.createdBy?.surname}
          </div>
          <div>
            <span className="font-medium text-foreground">Produkt:</span>{" "}
            {article.product?.name}
          </div>
          <div>
            <span className="font-medium text-foreground">Kategoria:</span>{" "}
            {article.category.name}
          </div>
        </div>

        {/* Tagi */}
        <div className="flex flex-wrap gap-1">
          {article.tags.map((tag) => (
            <Badge
              key={tag._id}
              className="bg-accent text-muted-foreground rounded-full px-2 py-0.5 text-[10px] max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingArticleCard;
