import { Copy } from "lucide-react";
import type { ResponseVariant } from "../../types/article";

interface VariantContentSectionProps {
  displayedVariant: ResponseVariant | undefined;
  contentRef: React.RefObject<HTMLDivElement | null>;
  handleCopy: () => void;
}

const VariantContentSection = ({ contentRef, handleCopy, displayedVariant }: VariantContentSectionProps) => {
  return (
    <div
      ref={contentRef}
      className="mt-4 text-sm leading-relaxed whitespace-pre-wrap min-h-[74vh] max-h-[74vh] overflow-y-auto border border-border rounded-md px-3 py-2 bg-muted/5 scrollbar-custom"
    >
      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          className="p-1.5 bg-muted/20 rounded-md hover:bg-muted/40 border border-border transition-colors shadow-sm hover:shadow-md"
          title="Skopiuj tekst"
        >
          <Copy className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div>{displayedVariant?.variantContent || "Brak treści do wyświetlenia"}</div>
    </div>
  );
};

export default VariantContentSection;
