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
  permissions: Record<string, boolean>;
}

export function ArticleVariants({ articleId, variants, onCopy, permissions }: ArticleVariantsGridProps) {
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);

  if (!variants.length) {
    return <div className="text-center py-20 text-muted-foreground">Brak wariantów odpowiedzi</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-5 pb-8">
        {variants.map((v) => (
          <ArticleVariantCard
            key={v._id}
            name={v.variantName}
            content={v.variantContent}
            onCopy={onCopy}
            onEdit={() => setEditingVariant(v)}
            onDelete={() => {}}
            permissions={permissions}
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
