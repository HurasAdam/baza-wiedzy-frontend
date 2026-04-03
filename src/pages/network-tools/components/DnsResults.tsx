import type { DNSRecords } from "../../../services/network-tools.service";

interface Props {
  content: DNSRecords | null | undefined;
}

export const DnsResults = ({ content }: Props) => {
  return (
    <div className="mt-6 space-y-6 font-mono pb-6">
      {content &&
        Object.entries(content).map(([type, records]) => (
          <div key={type} className="bg-card rounded-xl shadow-md border border-border p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">{type}</h3>
              <span className="text-sm text-muted-foreground">
                {Array.isArray(records) ? records.length : 1} rekordów
              </span>
            </div>

            {Array.isArray(records) && records.length === 0 && (
              <div className="text-muted-foreground bg-background/95 p-3 rounded-lg text-sm">Brak rekordów</div>
            )}

            {Array.isArray(records) && records.length > 0 && (
              <ul className="space-y-2">
                {records.map((record, index) => (
                  <li key={index} className="bg-background/95 rounded-lg p-3 text-sm text-foreground">
                    {typeof record === "object" && !Array.isArray(record)
                      ? Object.entries(record)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")
                      : Array.isArray(record)
                        ? record.join(" ")
                        : record}
                  </li>
                ))}
              </ul>
            )}

            {!Array.isArray(records) && (
              <div className="bg-background/95 rounded-lg p-3 text-sm text-foreground">
                {Object.entries(records)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ")}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
