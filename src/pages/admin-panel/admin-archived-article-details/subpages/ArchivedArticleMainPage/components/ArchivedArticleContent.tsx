import type { Article } from "../../../../../../types/article";
import { ArticleEmployeeNotes } from "../../../../../articlev2/ArticleMainPage/components/ArticleEmployeeNotes";
import { ArticleMetadata } from "../../../../../articlev2/ArticleMainPage/components/ArticleMetadata";
import { ArticleResponseVariants } from "../../../../../articlev2/ArticleMainPage/components/ArticleResponseVariants";
import { ArchivedArticleUserActions } from "./ArchivedArticleUserActions";

export interface ContentActions {
  onRestoreRequest: () => void;
  onDeleteRequest: () => void;
}

interface Props {
  article: Article;
  articleUserFlag: { selectedFlag: { _id: string; name: string; color: string } | null };
  isFollowPending: boolean;
  isUnfollowPending: boolean;
  actions: ContentActions;
  userPermissions: string[];
  isMarkAsImportantLoading: boolean;
}

export const ArchivedArticleContent = ({
  article,
  articleUserFlag,
  actions,
  isFollowPending,
  isUnfollowPending,
  userPermissions,
  isMarkAsImportantLoading,
}: Props) => {
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

        <ArchivedArticleUserActions
          article={article}
          articleUserFlag={articleUserFlag}
          isFollowPending={isFollowPending}
          isUnfollowPending={isUnfollowPending}
          userPermissions={userPermissions}
          actions={actions}
          isMarkAsImportantLoading={isMarkAsImportantLoading}
        />
      </div>
    </div>
  );
};
