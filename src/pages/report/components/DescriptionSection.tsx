import { BugDedcription } from "./BugDedcription";
import { ProposalDescription } from "./ProposalDescription";

interface DescriptionSectionProps {
  report: any;
}

export function DescriptionSection({ report }: DescriptionSectionProps) {
  if (report.type === "proposal") {
    return <ProposalDescription report={report} />;
  }

  return <BugDedcription report={report} />;
}
