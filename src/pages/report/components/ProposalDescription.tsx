import { FileTextIcon } from "lucide-react";
import { DescriptionCard } from "./DescriptionCard";

interface Props {
  report: any;
}

export const ProposalDescription = ({ report }: Props) => {
  return (
    <div className="space-y-4">
      <DescriptionCard className="min-h-[255px]" title="Opis propozycji" icon={<FileTextIcon />}>
        {report.currentBehavior}
      </DescriptionCard>

      {report.expectedBehavior && (
        <DescriptionCard className="min-h-[255px]" title="Przewidywana korzyść" icon="✅">
          {report.expectedBehavior}
        </DescriptionCard>
      )}

      {report.file && report.file.length > 0 && (
        <DescriptionCard title="Załączniki" icon="📎">
          {report.file.map((f: any, i: number) => (
            <p key={i}>{f.name}</p>
          ))}
        </DescriptionCard>
      )}
    </div>
  );
};
