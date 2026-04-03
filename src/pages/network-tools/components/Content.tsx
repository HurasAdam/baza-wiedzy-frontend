import type { DNSRecords } from "../../../services/network-tools.service";
import { DnsResults } from "./DnsResults";
import EmptyState from "./EmptyState";
import { ErrorState } from "./ErrorState";
import type { DNSFormValues } from "./FilterBar";

interface Props {
  isError: boolean;
  error: unknown;
  content: DNSRecords | null | undefined;
  refetch: () => void;
  queryParams: DNSFormValues | null;
}
const RecordsContent = ({ isError, queryParams, error, content, refetch }: Props) => {
  if (isError) return <ErrorState onRetry={refetch} />;

  if (!queryParams && !error) return <EmptyState />;

  if (content) return <DnsResults content={content} />;
};

export default RecordsContent;
