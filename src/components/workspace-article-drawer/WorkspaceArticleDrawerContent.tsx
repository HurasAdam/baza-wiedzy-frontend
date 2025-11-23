import type { Article, ResponseVariant } from "../../types/article";
import ArticleDrawerSkeleton from "../article-drawer/ArticleDrawerSkeleton";
import VariantContentSection from "../article-drawer/VariantContentSection";
import VariantsSelectorSection from "../article-drawer/VariantsSelectorSection";

interface ArticleDrawerContentProps {
  article: Article | undefined;
  isLoading: boolean;
  variants: ResponseVariant[];
  displayedVariant: ResponseVariant | undefined;
  selectedVariant: string | null;
  setSelectedVariant: (id: string) => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
  handleCopy: () => void;
}

const WorkspaceArticleDrawerContent: React.FC<ArticleDrawerContentProps> = ({
  article,
  isLoading,
  variants,
  displayedVariant,
  setSelectedVariant,
  contentRef,
  handleCopy,
}) => {
  if (isLoading) return <ArticleDrawerSkeleton />;

  if (!article) return <p className="text-center text-sm text-muted-foreground py-12">Nie znaleziono artykułu.</p>;

  return (
    <div className="space-y-4">
      <VariantsSelectorSection
        variants={variants}
        setSelectedVariant={setSelectedVariant}
        displayedVariant={displayedVariant}
      />
      <VariantContentSection handleCopy={handleCopy} contentRef={contentRef} displayedVariant={displayedVariant} />
    </div>
  );
};

export default WorkspaceArticleDrawerContent;
