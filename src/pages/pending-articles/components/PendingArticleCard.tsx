import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import type { ArticleListItem } from "../../../types/article";

const PendingArticleCard = ({
  userPermissions,
  className,
  article,
  onApprove,
  onReject,
  loading,
}: {
  userPermissions: string[];
  className?: string;
  article: ArticleListItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}) => {
  const navigate = useNavigate();

  const onPreview = () => {
    navigate(`/articles/${article._id}`);
  };

  return (
    <Card
      key={article._id}
      className="w-full transition-shadow hover:shadow-sm border border-border rounded-xl p-4 bg-card"
    >
      <CardContent className="p-0 flex flex-col gap-4">
        {/* Header z tytułem i przyciskami po prawej */}
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-base font-semibold text-card-foreground leading-snug break-words line-clamp-2 space-x-1.5">
            <span className="font-medium text-sm text-muted-foreground">Tytuł:</span>
            <span>{article.title}</span>
          </h2>

          <div className="flex gap-2 shrink-0">
            {userPermissions.includes("APPROVE_ARTICLE") && (
              <Button
                className="cursor-pointer text-foreground"
                onClick={() => onApprove(article._id)}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Zatwierdź"}
              </Button>
            )}
            {userPermissions.includes("REJECT_ARTICLE") && (
              <Button
                className="cursor-pointer text-foreground"
                onClick={() => onReject(article._id)}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                Odrzuć
              </Button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-muted-foreground flex flex-col gap-1">
          <div>
            <span className="font-medium text-muted-foreground">Autor:</span>{" "}
            <span className="text-foreground">{article.createdBy?.name}</span>
            <span className="text-foreground"> {article.createdBy?.surname}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Produkt:</span>{" "}
            <span className="text-primary-foreground">{article.product?.name}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Kategoria:</span>
            <span className="text-primary-foreground"> {article.category.name}</span>
          </div>
        </div>
        <div className="flex justify-between w-full">
          {/* Tagi */}
          <div className="flex flex-wrap gap-1">
            {article.tags.map((tag) => (
              <Badge
                variant="outline"
                key={tag._id}
                className="  px-2 py-0.5 text-[10px] max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
              >
                # {tag.name}
              </Badge>
            ))}
          </div>
          <Button className="cursor-pointer" onClick={onPreview}>
            Wyświetl
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingArticleCard;
