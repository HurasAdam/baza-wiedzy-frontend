import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CheckCircleIcon, Copy, Info, Loader, XCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useFindArticleQuery } from "../../hooks/articles/use-articles";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ArticleDrawerProps {
  articleId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ArticleDrawer: React.FC<ArticleDrawerProps> = ({ articleId, open, onOpenChange }) => {
  const { data: article, isLoading } = useFindArticleQuery(articleId || undefined);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const variants = article?.responseVariants || [];
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
  }, [open, variants, displayedVariant]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="min-w-[640px] p-6">
        {/* Nagłówek */}
        <SheetHeader className="border-b border-border pb-3">
          <SheetTitle className="text-xl font-semibold text-foreground">
            {article ? article.title : "Podgląd artykułu"}
          </SheetTitle>

          {article && (
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {article.status === "approved" && (
                  <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center whitespace-nowrap">
                    <CheckCircleIcon className="w-4 h-4 mr-1" /> Zweryfikowany
                  </Badge>
                )}
                {article.status === "pending" && (
                  <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center whitespace-nowrap">
                    <XCircleIcon className="w-4 h-4 mr-1" /> Wymaga weryfikacji
                  </Badge>
                )}
                {(article.status === "draft" || article.status === "rejected") && (
                  <Badge className="bg-destructive/10 text-rose-800/95 border border-destructive/30 flex items-center whitespace-nowrap">
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    {article.status === "draft" ? "Wymaga zatwierdzenia" : "Odrzucony"}
                  </Badge>
                )}
              </div>

              <span className="text-sm text-muted-foreground">
                {article.product?.name ?? "Brak produktu"} • {article.category?.name ?? "Brak kategorii"}
              </span>
            </div>
          )}
        </SheetHeader>

        {/* Loader */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : article ? (
          <div className=" space-y-4">
            {variants.length > 1 && (
              <>
                <div className="flex items-center justify-between mt-1.5 mr-4">
                  <div className="flex gap-2 flex-wrap">
                    {variants.map((variant) => (
                      <button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant._id)}
                        className={`
              px-3 py-1 rounded border text-sm transition-colors duration-150 
              max-w-[120px] truncate
              ${
                displayedVariant?._id === variant._id
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-muted-foreground/10 border-border hover:bg-muted-foreground/20"
              }
            `}
                        title={variant.variantName}
                      >
                        {variant.variantName}
                      </button>
                    ))}
                  </div>

                  {/* Tooltip z instrukcją klawiaturową */}

                  <div className="relative">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-1.5 bg-muted/20 rounded-full cursor-pointer hover:bg-muted/40 border border-border transition-all shadow-sm hover:shadow-md">
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground shadow-lg border">
                        <p className="text-xs">Użyj klawiszy 1–9, aby przełączać warianty.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </>
            )}

            <div className="mt-4 text-sm leading-relaxed whitespace-pre-wrap min-h-[74vh] max-h-[74vh] overflow-y-auto border border-border rounded-md px-3 py-2 bg-muted/5 scrollbar-custom">
              {/* Wrapper dla przycisku i treści */}
              <div className="flex justify-end">
                <button
                  onClick={handleCopy}
                  className="p-1.5 bg-muted/20 rounded-md hover:bg-muted/40 border border-border transition-colors shadow-sm hover:shadow-md"
                  title="Skopiuj tekst"
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Treść */}
              <div>{displayedVariant ? displayedVariant.variantContent : "Brak treści do wyświetlenia"}</div>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-12">Nie znaleziono artykułu.</p>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ArticleDrawer;
