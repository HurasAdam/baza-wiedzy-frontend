import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useFindArticleQuery } from "../../hooks/articles/use-articles";
import ArticleDrawerContent from "./ArticleDrawerContent";
import ArticleDrawerHeader from "./ArticleDrawerHeader";

interface ArticleDrawerProps {
  articleId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ArticleDrawer = ({ articleId, open, onOpenChange }: ArticleDrawerProps) => {
  const { data: article, isLoading } = useFindArticleQuery(articleId || undefined);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const variants = useMemo(() => article?.responseVariants || [], [article?.responseVariants]);
  const displayedVariant = selectedVariant ? variants.find((v) => v._id === selectedVariant) : variants[0];

  useEffect(() => {
    setSelectedVariant(null);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [articleId]);

  useEffect(() => {
    const handleVariantKeySwitch = (e: KeyboardEvent) => {
      if (!open || variants.length <= 1) return;

      const index = parseInt(e.key, 10) - 1;
      if (!isNaN(index) && index >= 0 && index < variants.length) {
        setSelectedVariant(variants[index]._id);

        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      }
    };

    window.addEventListener("keydown", handleVariantKeySwitch);
    return () => window.removeEventListener("keydown", handleVariantKeySwitch);
  }, [open, variants]);

  const handleCopy = () => {
    if (displayedVariant?.variantContent) {
      navigator.clipboard.writeText(displayedVariant.variantContent);
      toast.info("Skopiowno do schowka", {
        position: "bottom-right",
        description: "Treść odpowiedzi została skopiowana",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      const index = parseInt(e.key, 10) - 1;
      if (!isNaN(index) && index >= 0 && index < variants.length) {
        setSelectedVariant(variants[index]._id);
        if (contentRef.current) contentRef.current.scrollTop = 0;
        return;
      }

      if (e.key.toLowerCase() === "c") {
        handleCopy();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, variants, displayedVariant]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="min-w-[660px] p-6">
        <ArticleDrawerHeader article={article} />

        <ArticleDrawerContent
          article={article}
          isLoading={isLoading}
          variants={variants}
          displayedVariant={displayedVariant}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          contentRef={contentRef}
          handleCopy={handleCopy}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ArticleDrawer;
