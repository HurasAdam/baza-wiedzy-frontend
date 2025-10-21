import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, ChevronDown, FileText, Info } from "lucide-react";
import { useState } from "react";
import { useFindLogsQuery } from "../../../hooks/log/use-log";

export const AdminLogsPage = () => {
  const { data: logs } = useFindLogsQuery();
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const toggleExpand = (id: string) => setExpandedLog(expandedLog === id ? null : id);

  const levelIcons: Record<string, JSX.Element> = {
    error: <AlertCircle size={16} className="inline mr-1" />,
    warn: <AlertTriangle size={16} className="inline mr-1" />,
    info: <Info size={16} className="inline mr-1" />,
    debug: <FileText size={16} className="inline mr-1" />,
  };

  return (
    <div className="p-6 space-y-4 bg-background text-foreground font-mono">
      {/* Nagłówek strony */}
      <header className="flex items-center gap-3 mb-4">
        <FileText size={28} className="text-foreground" />
        <h1 className="text-2xl font-semibold">Logi systemowe</h1>
      </header>

      {/* Lista logów w stylu terminala z akordeonem */}
      <div className="space-y-1 overflow-auto max-h-[70vh]">
        {logs?.map((log) => (
          <div
            key={log._id}
            className="flex flex-col rounded hover:bg-accent/20 transition cursor-pointer border border-border"
          >
            {/* Nagłówek akordeonu */}
            <div className="flex items-center justify-between p-2" onClick={() => toggleExpand(log._id)}>
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground/70">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <Badge variant={log.level} className="px-2 py-0.5 rounded text-xs flex items-center">
                  {levelIcons[log.level] || levelIcons.debug}
                  {log.level.toUpperCase()}
                </Badge>
                <span className="ml-2">{log.message}</span>
              </div>
              <ChevronDown
                size={16}
                className={`transform transition-transform ${expandedLog === log._id ? "rotate-180" : ""}`}
              />
            </div>

            {/* Treść akordeonu */}
            {expandedLog === log._id && (
              <div className="p-2 bg-card border-t border-border text-xs overflow-auto">
                <pre>{log.meta?.stack || "Brak szczegółów"}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
