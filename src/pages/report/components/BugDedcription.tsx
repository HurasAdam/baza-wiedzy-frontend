import { FileTextIcon } from "lucide-react";
import { DescriptionCard } from "./DescriptionCard";

export const BugDedcription = ({ report }) => {
  return (
    <div className="space-y-4">
      <DescriptionCard className="min-h-[174px]" title="Co działa nie tak?" icon={<FileTextIcon />}>
        {report.currentBehavior}
      </DescriptionCard>

      <DescriptionCard className="min-h-[174px]" title="Jak powinno działać?" icon="✅">
        {report.expectedBehavior}
      </DescriptionCard>

      {report.reproductionSteps && report.reproductionSteps.length > 0 && (
        <DescriptionCard className="min-h-[174px]" title="Kroki wymagane do odtworzenia" icon="🔁">
          {report?.reproductionSteps?.join("\n")}
        </DescriptionCard>
      )}
    </div>
  );
};
