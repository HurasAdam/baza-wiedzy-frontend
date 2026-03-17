import { Card } from "@/components/ui/card";
import { Calendar, FileText, Fingerprint, Folder, User } from "lucide-react";

export function ArticleMetaSection({ article }: { article: any }) {
  return (
    <div className="lg:w-80 lg:sticky lg:top-6 h-max space-y-4 mt-6 lg:mt-0">
      <Card className="p-6 shadow-xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <h3 className="text-sm font-semibold text-foreground mb-4 border-b border-border pb-3">Szczegóły artykułu</h3>

        <div className="flex flex-col gap-5">
          <MetaRow icon={<Fingerprint />} label="ID artykułu" value={article._id} mono />

          <MetaRow icon={<Folder />} label="Folder" value={article.folder?.name} />

          <MetaRow
            icon={<Calendar />}
            label="Data utworzenia"
            value={new Date(article.createdAt).toLocaleDateString("pl-PL")}
          />

          <MetaRow icon={<User />} label="Autor" value={`${article.createdBy.name} ${article.createdBy.surname}`} />

          <MetaRow icon={<FileText />} label="Liczba wariantów" value={article.responseVariants?.length || 0} />
        </div>
      </Card>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      {/* Ikona */}
      <div className="mt-1 p-2 rounded-lg border bg-muted/40 text-muted-foreground">{icon}</div>

      {/* Content */}
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>

        <span className={`text-sm font-medium text-foreground break-words ${mono ? "font-mono text-xs" : ""}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
