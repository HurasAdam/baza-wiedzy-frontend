import { HeartIcon, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";
import type { ArticleListItem } from "../../../types/article";

const ArticleCard = ({
  article,
  toggleFavourite,
  toggleFavouriteLoading,
}: {
  article: ArticleListItem;
  toggleFavourite: (id: string) => void;
  toggleFavouriteLoading: boolean;
}) => {
  return (
    <>
      <Link to={`/articles/${article._id}`}>
        <Card
          key={article._id}
          className="transition-shadow hover:shadow-sm border border-border rounded-xl p-3 bg-card"
        >
          <CardContent className="p-0 flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <h2 className="text-base font-medium text-card-foreground leading-snugm mb-3.5">
                {article.title}
              </h2>
              <Button
                className="cursor-pointer"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavourite(article._id);
                }}
              >
                {toggleFavouriteLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <HeartIcon
                    className={cn(
                      "h-4 w-4",
                      article.isFavourite
                        ? "text-primary/65 fill-primary/65"
                        : "text-muted-foreground"
                    )}
                  />
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                Wyświetleń : {article.viewsCounter}
              </span>
            </div>

            <div className="flex justify-between items-end mt-2">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="flex items-center gap-1">
                  {article.isVerified ? (
                    <span className="">Zweryfikowany</span>
                  ) : (
                    <span className="">Oczekujący weryfikacji</span>
                  )}
                </span>
                <span className="mx-1">|</span>
                <span className="font-medium text-foreground">
                  {article.category.name}
                </span>
              </div>
              <div className="flex flex-wrap justify-end gap-1">
                {article.tags.map((tag) => (
                  <Badge
                    key={tag._id}
                    className="bg-accent text-muted-foreground rounded-full px-2 py-0.5 text-[10px]"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </>
  );
};

export default ArticleCard;
