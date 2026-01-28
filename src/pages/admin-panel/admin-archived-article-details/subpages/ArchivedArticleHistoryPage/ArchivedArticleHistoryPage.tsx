import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFindArticleHistoryQuery } from "@/hooks/articles-history/use-articles-history";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  CloudUpload,
  Edit3,
  Eye,
  FolderX,
  Loader,
  PlusCircle,
  RefreshCw,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import type { ArticleOutletContext } from "../../../../article/ArticleMainPage";

export function ArchivedArticleHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: historyList = [], isFetching, refetch } = useFindArticleHistoryQuery(id!);

  const { article } = useOutletContext<ArticleOutletContext>();
  const filtered = useMemo(() => historyList, [historyList]);

  return (
    <div className="space-y-6 mx-auto h-full">
      {/* Nagłówek */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="w-16 h-16 hover:bg-muted/30 flex items-center justify-center rounded-lg bg-background"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-8 h-8" />
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold max-w-[840px] break-words">{article.title}</h1>
            <p className="text-sm text-muted-foreground">Przegląd wszystkich zmian w artykule</p>
          </div>
        </div>

        {/* Odświeżanie */}
        <Button onClick={() => refetch()} variant="outline" className="p-3 rounded transition mr-2" title="Odśwież">
          {isFetching ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Odśwież
        </Button>
      </div>

      {/* Timeline historii */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">Brak wpisów historii</div>
        )}

        {filtered.map((item: any) => {
          const cfg = eventConfig(item.eventType);
          const Icon = cfg.Icon;

          const statusChange =
            item.statusChange && item.statusChange.from !== item.statusChange.to ? item.statusChange : null;

          return (
            <Card
              key={item._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4 hover:shadow-lg transition-all duration-200 rounded-lg bg-card/70 hover:bg-card border border-border"
            >
              <div className="flex items-start sm:items-center gap-4 w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-background border border-border flex-shrink-0">
                  <Icon className={`w-5 h-5 ${cfg.bgClass}`} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{cfg.label}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {item.createdBy?.name} {item.createdBy?.surname}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{relativeTime(item.createdAt)}</div>

                  {statusChange && (
                    <div className="text-xs mt-2 flex flex-wrap gap-1">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-muted-foreground">
                        {statusLabels[String(statusChange.from)] ?? statusChange.from}
                      </span>
                      <span>→</span>
                      <span className="font-medium">{statusLabels[String(statusChange.to)] ?? statusChange.to}</span>
                    </div>
                  )}
                </div>
              </div>

              <Link to={`/admin/articles/archived/${id}/history/${item._id}`} className="flex-shrink-0">
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Szczegóły
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------- helpers --------------------- */
function relativeTime(d: any) {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hrs = Math.floor(min / 60);
  const days = Math.floor(hrs / 24);
  const years = Math.floor(days / 365);

  if (sec < 60) return `${sec} s temu`;
  if (min < 60) return `${min} min temu`;
  if (hrs < 24) return `${hrs} godz. temu`;
  if (days === 1) return `wczoraj`;
  if (years >= 1) return `${years} ${years === 1 ? "rok" : "lata"} temu`;
  return `${days} dni temu`;
}

const statusLabels: Record<string, string> = {
  approved: "Zatwierdzony",
  pending: "Wymaga weryfikacji",
  rejected: "Wymagający poprawy",
  draft: "Szkic roboczy",
};

function eventConfig(eventType: string | undefined) {
  const map: Record<string, { label: string; Icon: any; bgClass: string }> = {
    created: { label: "Utworzenie artykułu", Icon: PlusCircle, bgClass: "text-emerald-600" },
    updated: { label: "Edycja artykułu", Icon: Edit3, bgClass: "text-sky-600" },
    trashed: { label: "Przeniesiono do kosza", Icon: Trash2, bgClass: "text-neutral-700" },
    restored: { label: "Przywrócono artykuł", Icon: RotateCcw, bgClass: "text-amber-500" },
    verified: { label: "Weryfikacja artykułu", Icon: CheckCircle, bgClass: "text-emerald-700" },
    unverified: { label: "Odwołano weryfikację", Icon: XCircle, bgClass: "text-red-600" },
    expired: { label: "Wymaga ponownej weryfikacji", Icon: Clock, bgClass: "text-amber-500/65" },
    attachmentAdded: { label: "Dodano załącznik", Icon: CloudUpload, bgClass: "text-purple-500/70" },
    attachmentRemoved: { label: "Usunięto załącznik", Icon: FolderX, bgClass: "text-rose-500/70" },
  };
  return map[eventType ?? ""] ?? { label: "Zmiana", Icon: Edit3, bgClass: "text-primary" };
}
