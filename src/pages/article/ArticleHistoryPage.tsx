import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFindArticleHistoryQuery } from "@/hooks/articles-history/use-articles-history";
import { CheckCircle, Edit3, Eye, PlusCircle, RotateCcw, Trash2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

export function ArticleHistoryPage() {
  const { id } = useParams();
  const { data: articleHistoryList = [] } = useFindArticleHistoryQuery(id!);

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!articleHistoryList || articleHistoryList.length === 0) return [];
    const q = query.trim().toLowerCase();
    return articleHistoryList.filter((item: any) => {
      if (!q) return true;
      const author = `${item.createdBy?.name ?? ""} ${item.createdBy?.surname ?? ""}`.toLowerCase();
      return author.includes(q) || (item.eventType ?? "").toString().toLowerCase().includes(q);
    });
  }, [articleHistoryList, query]);

  return (
    <div className="">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full px-3 py-1">
            <h3 className="text-sm font-semibold">Historia zmian</h3>
            <p className="text-xs text-muted-foreground">Szybki podgląd zdarzeń</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input
            placeholder="Szukaj po autorze..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-md"
          />
          <Button variant="ghost" size="sm" onClick={() => setQuery("")}>
            Wyczyść
          </Button>
        </div>
      </div>

      <Card className="bg-transparent shadow-none border-none">
        <CardContent className="p-0">
          <ul className="space-y-3">
            {filtered.map((item: any) => {
              const cfg = eventConfig(item.eventType);
              const Icon = cfg.Icon;

              // sprawdź czy jest zmiana statusu
              const statusChange =
                item.statusChange && item.statusChange.from !== item.statusChange.to ? item.statusChange : null;

              return (
                <li key={item._id}>
                  <div className="flex items-center justify-between bg-card p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-11 h-11 rounded-xl ${cfg.bgClass} text-white shadow`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="text-sm font-semibold">{cfg.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.createdBy?.name} {item.createdBy?.surname}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {relativeTime(item.createdAt)} •{" "}
                          <span className="text-[11px]">{formatDate(item.createdAt)}</span>
                        </div>

                        {/* 👇 tu dokładamy extra info o statusie */}
                        {statusChange && (
                          <div className="text-xs mt-2">
                            <span className="text-muted-foreground">Status: </span>
                            <span className="font-base text-muted-foreground">
                              {statusLabels[String(statusChange.from)] ?? statusChange.from}
                            </span>{" "}
                            →{" "}
                            <span className="font-base">
                              {statusLabels[String(statusChange.to)] ?? statusChange.to}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Link to={`/articles/history/${item._id}`} aria-label={`Szczegóły wpisu ${item._id}`}>
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Szczegóły
                        </Button>
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}

            {filtered.length === 0 && (
              <li className="text-center text-sm text-muted-foreground py-8">Brak wpisów historii</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

/* --------------------- helpers --------------------- */

function formatDate(d: any) {
  try {
    return new Date(d).toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" });
  } catch (e) {
    return String(d);
  }
}

function relativeTime(d: any) {
  if (!d) return "";
  const ts = new Date(d).getTime();
  const diff = Date.now() - ts;
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
  approved: "Zatwierdzony", // Approved → zatwierdzony
  pending: "Wymaga weryfikacji", // Pending → wymaga weryfikacji
  rejected: "Wymagający poprawy", // Rejected → wymagający poprawy
  draft: "Szkic roboczy", // Draft → wersja robocza / szkic, może pasuje do Twojego workflow
};

function eventConfig(eventType: string | undefined) {
  // prosty mapping, możesz przenieść do utils/getEventConfig jeśli chcesz
  const map: Record<string, { label: string; Icon: any; bgClass: string }> = {
    created: { label: "Utworzenie artykułu", Icon: PlusCircle, bgClass: "bg-emerald-600" },
    updated: { label: "Edycja artykułu", Icon: Edit3, bgClass: "bg-sky-600" },
    trashed: { label: "Przeniesiono do kosza", Icon: Trash2, bgClass: "bg-neutral-700" },
    restored: { label: "Przywrócono artykuł", Icon: RotateCcw, bgClass: "bg-amber-500" },
    verified: { label: "Weryfikacja artykułu", Icon: CheckCircle, bgClass: "bg-emerald-700" },
    unverified: { label: "Odwołano weryfikację", Icon: XCircle, bgClass: "bg-red-600" },
  };

  return map[eventType ?? ""] ?? { label: "Zmiana", Icon: Edit3, bgClass: "bg-primary" };
}
