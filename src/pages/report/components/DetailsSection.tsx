import { DescriptionSection } from "./DescriptionSection";
import { MetaSection } from "./MetaSection";

interface DetailsSectionProps {
  report: any;
}

export function DetailsSection({ report }: DetailsSectionProps) {
  return (
    <div className="mt-8 flex flex-col lg:flex-row lg:gap-6">
      <div className="lg:flex-1 space-y-6">
        <DescriptionSection report={report} />
      </div>

      <MetaSection report={report} />
    </div>
  );
}
