import { Loader, Trash, Undo } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../../components/ui/card";
import type { Article } from "../../../../../../types/article";
import type { ContentActions } from "./ArchivedArticleContent";

interface Props {
  article: Article;
  articleUserFlag: { selectedFlag: { _id: string; name: string; color: string } | null };
  isFollowPending: boolean;
  isUnfollowPending: boolean;
  actions: ContentActions;
  userPermissions: string[];
  isMarkAsImportantLoading: boolean;
}

export const ArchivedArticleUserActions = ({ article, userPermissions, isMarkAsImportantLoading, actions }: Props) => {
  const { onRestoreRequest, onDeleteRequest } = actions;

  return (
    <Card className="shadow-sm border bg-card/70">
      <CardContent className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Dostępne akcje</h3>

        <Button
          size="sm"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={onRestoreRequest}
        >
          <Undo className="w-4 h-4" /> Przywróć z archiwum
        </Button>

        {userPermissions.includes("SET_ARTICLE_PRIORITY") && (
          <Button
            size="sm"
            variant={article.isImportant ? "destructive" : "secondary"}
            className="w-full flex items-center justify-center gap-2"
            onClick={onDeleteRequest}
            disabled={isMarkAsImportantLoading}
          >
            {isMarkAsImportantLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Przetwarzanie...
              </>
            ) : (
              <>
                <Trash className="w-4 h-4" />
                Usuń artykuł
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
