import { useState } from "react";
import { EditWorkspaceArticleVariantModal } from "../../../components/workspace-article-variant/EditWorkspaceArticleVariantModal";
import { ArticleVariantCard } from "./ArticleVariantCard";

interface Variant {
  _id: string;
  variantName: string;
  variantContent: string;
}

interface ArticleVariantsGridProps {
  articleId: string;
  variants: Variant[];
  onCopy: (text: string) => void;
}

export function ArticleVariants({ articleId, variants, onCopy }: ArticleVariantsGridProps) {
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);

  return (
    <>
      <div className={`grid gap-4 ${variants.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
        {variants.map((v) => (
          <ArticleVariantCard
            key={v._id}
            name={v.variantName}
            content={v.variantContent}
            onCopy={onCopy}
            onEdit={() => setEditingVariant(v)}
            onDelete={() => {}}
          />
        ))}
      </div>
      <EditWorkspaceArticleVariantModal
        articleId={articleId}
        isOpen={!!editingVariant}
        variant={editingVariant}
        onClose={() => setEditingVariant(null)}
      />
    </>
  );
}
