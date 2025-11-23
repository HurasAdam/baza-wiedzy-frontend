import type { ResponseVariant } from "../../types/article";

interface VariantButtonProps {
  variant: ResponseVariant;
  isSelected: boolean;
  onSelect: (variantId: string) => void;
}

const VariantButton = ({ variant, isSelected, onSelect }: VariantButtonProps) => (
  <button
    key={variant._id}
    onClick={() => onSelect(variant._id)}
    className={`px-3 py-1 rounded border text-sm transition-colors duration-150 max-w-[120px] truncate ${
      isSelected
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-muted-foreground/10 border-border hover:bg-muted-foreground/20"
    }`}
    title={variant.variantName}
  >
    {variant.variantName}
  </button>
);

export default VariantButton;
