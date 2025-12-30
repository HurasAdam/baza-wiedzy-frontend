import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "../../../../components/ui/card";

interface ResponseVariant {
  variantName?: string;
  variantContent: string;
}

interface Props {
  responseVariants: ResponseVariant[];
}

export const ArticleResponseVariants = ({ responseVariants }: Props) => {
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);

  return (
    <Card className="shadow-sm border bg-card/70 pt-3">
      <CardContent>
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <h2 className="text-base font-semibold">Szablon odpowiedzi</h2>
          {responseVariants.length > 1 && (
            <div className="flex gap-2">
              {responseVariants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setActiveVariantIndex(index)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 max-w-[170px] truncate ${
                    activeVariantIndex === index
                      ? "bg-card/70 border border-border text-foreground shadow-sm"
                      : "text-foreground/70 hover:bg-muted/80"
                  }`}
                  title={variant.variantName || `Wariant ${index + 1}`}
                >
                  {variant.variantName || `Wariant ${index + 1}`}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {/* Nagłówek z kopiowaniem */}
          <div className="flex justify-between items-center bg-background/50 p-2 rounded-md">
            <h3 className="text-xs uppercase font-semibold flex items-center gap-2">
              wariant:{" "}
              <span className="text-primary/90 font-medium">
                {responseVariants[activeVariantIndex].variantName || `Wersja ${activeVariantIndex + 1}`}
              </span>
            </h3>

            {responseVariants[activeVariantIndex].variantContent && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(responseVariants[activeVariantIndex].variantContent);
                  toast.success("Treść wariantu została skopiowana do schowka", { position: "bottom-right" });
                }}
                className="flex items-center justify-center w-8 h-8 rounded-md p-1 bg-background/70 hover:bg-primary/10 transition-colors duration-200 text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                aria-label="Kopiuj treść wariantu"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Treść wariantu */}
          <p className="text-[15.5px] whitespace-pre-wrap break-words text-foreground/90">
            {responseVariants[activeVariantIndex].variantContent}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
