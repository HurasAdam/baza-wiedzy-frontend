import { ArchiveIcon, Bell, BellOff, Flag, Loader, Plus, Star, StarOff } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import type { Article } from "../../../../types/article";
import type { ContentActions } from "./ArticleContent";

interface Props {
  article: Article;
  articleUserFlag: { selectedFlag: { _id: string; name: string; color: string } | null };
  isFollowPending: boolean;
  isUnfollowPending: boolean;
  actions: ContentActions;
  userPermissions: string[];
  isMarkAsImportantLoading: boolean;
}

export const ArticleUserActions = ({
  article,
  articleUserFlag,
  isFollowPending,
  isUnfollowPending,
  userPermissions,
  isMarkAsImportantLoading,
  actions,
}: Props) => {
  const {
    handleFollowToggle,
    onHandleUnflag,
    openMarkWithFlagModal,
    handleMarkAsImportant,
    handleUnmarkAsImportant,
    openAddFlagModal,
    onArchiveRequest,
  } = actions;

  return (
    <Card className="shadow-sm border bg-card/70">
      <CardContent className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Akcje użytkownika</h3>
        <Button
          size="sm"
          variant={article.isFollowed ? "default" : "outline"}
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleFollowToggle(article._id, article.isFollowed)}
          disabled={isFollowPending || isUnfollowPending}
        >
          {article.isFollowed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}{" "}
          {article.isFollowed ? "Przestań obserwować" : "Obserwuj"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => {
            if (articleUserFlag?.selectedFlag) {
              onHandleUnflag(article._id);
            } else {
              openMarkWithFlagModal();
            }
          }}
        >
          <Flag className="w-4 h-4 text-foreground" style={{ color: articleUserFlag?.selectedFlag?.color }} />
          {articleUserFlag?.selectedFlag ? (
            <>
              {articleUserFlag.selectedFlag.name}{" "}
              <span className="text-xs text-muted-foreground">(kliknij, aby usunąć)</span>
            </>
          ) : (
            "Oznacz etykietą"
          )}
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={openAddFlagModal}
        >
          <Plus className="w-4 h-4" /> Dodaj etykietę
        </Button>
        {userPermissions.includes("ARCHIVE_ARTICLE") && article.isVisible && (
          <Button
            size="sm"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={onArchiveRequest}
          >
            <ArchiveIcon className="w-4 h-4" /> Archiwizuj
          </Button>
        )}
        {userPermissions.includes("SET_ARTICLE_PRIORITY") && (
          <Button
            size="sm"
            variant={article.isImportant ? "destructive" : "secondary"}
            className="w-full flex items-center justify-center gap-2"
            onClick={() =>
              article.isImportant ? handleUnmarkAsImportant(article._id) : handleMarkAsImportant(article._id)
            }
            disabled={isMarkAsImportantLoading}
          >
            {isMarkAsImportantLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Przetwarzanie...
              </>
            ) : (
              <>
                {article.isImportant ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                {article.isImportant ? "Usuń priorytet" : "Oznacz priorytet"}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
