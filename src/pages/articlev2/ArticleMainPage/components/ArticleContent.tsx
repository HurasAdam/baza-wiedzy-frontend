import type { Article } from "../../../../types/article";
import { ArticleEmployeeNotes } from "./ArticleEmployeeNotes";
import { ArticleMetadata } from "./ArticleMetadata";
import { ArticleResponseVariants } from "./ArticleResponseVariants";
import { ArticleUserActions } from "./ArticleUserActions";

export interface ContentActions {
  handleFollowToggle: (articleId: string, isFollowed: boolean) => void;
  onHandleUnflag: (articleId: string) => void;
  openMarkWithFlagModal: () => void;
  handleMarkAsImportant: (articleId: string) => void;
  handleUnmarkAsImportant: (articleId: string) => void;
  openAddFlagModal: () => void;
}

interface Props {
  article: Article;
  articleUserFlag: { selectedFlag: { _id: string; name: string; color: string } | null };
  isFollowPending: boolean;
  isUnfollowPending: boolean;
  actions: ContentActions;
}

export const ArticleContent = ({ article, articleUserFlag, actions, isFollowPending, isUnfollowPending }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pb-10">
      {/* Lewa kolumna: Opis zgłoszenia */}
      <div className="md:col-span-2 flex flex-col gap-6">
        <ArticleEmployeeNotes employeeDescription={article.employeeDescription} />

        <ArticleResponseVariants
          responseVariants={article.responseVariants.map((v) => ({
            variantName: v.variantName,
            variantContent: v.variantContent,
          }))}
        />
      </div>

      {/* Prawa kolumna: Metadane + Akcje */}
      <div className="flex flex-col gap-6">
        <ArticleMetadata article={article} />

        <ArticleUserActions
          article={article}
          articleUserFlag={articleUserFlag}
          isFollowPending={isFollowPending}
          isUnfollowPending={isUnfollowPending}
          actions={actions}
        />
      </div>
    </div>
  );
};
