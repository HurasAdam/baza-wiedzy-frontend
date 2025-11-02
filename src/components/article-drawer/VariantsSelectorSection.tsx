import type { ResponseVariant } from "../../types/article";
import VariantButton from "./VariantButton";
import VariantsShortcutTooltip from "./VariantsShortcutTooltip";

interface VariantsSelectorSectionProps {
  variants: ResponseVariant[];
  displayedVariant: ResponseVariant | undefined;
  setSelectedVariant: (id: string) => void;
}

const VariantsSelectorSection = ({ variants, setSelectedVariant, displayedVariant }: VariantsSelectorSectionProps) => {
  return (
    <div>
      {variants.length > 1 && (
        <div className="flex items-center justify-between mt-1.5 mr-4">
          <div className="flex gap-2 flex-wrap">
            {variants.map((variant) => (
              <VariantButton
                key={variant._id}
                variant={variant}
                isSelected={displayedVariant?._id === variant._id}
                onSelect={setSelectedVariant}
              />
            ))}
          </div>

          <VariantsShortcutTooltip />
        </div>
      )}
    </div>
  );
};

export default VariantsSelectorSection;
