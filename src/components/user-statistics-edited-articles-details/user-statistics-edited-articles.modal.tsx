import { Edit3, Loader2 } from "lucide-react";
import { useFindUserEditedArticles } from "../../hooks/user-statistics/user-user-statistics";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface SelectedUser {
  userId?: string;
  name?: string;
  surname?: string;
  avatarUrl?: string;
  email?: string;
  role?: string;
}

interface UserStatisticsDetailsModalProps {
  selectedUser: SelectedUser | null;
  isUserStatisticsModalOpen: boolean;
  setIsUserStatisticsModalOpen: (isOpen: boolean) => void;

  startDate?: Date;
  endDate?: Date;
}

export const UserStatisticsEditedArticlesModal = ({
  selectedUser,
  isUserStatisticsModalOpen,
  setIsUserStatisticsModalOpen,

  startDate,
  endDate,
}: UserStatisticsDetailsModalProps) => {
  const userId = selectedUser?.userId ?? null;
  const params = {
    userId,
    startDate,
    endDate,
  };
  const { data, isLoading } = useFindUserEditedArticles(params);

  const statusTranslations: Record<string, { label: string; tone: string }> = {
    approved: { label: "Zaakceptowany", tone: "green" },
    rejected: { label: "Odrzucony", tone: "red" },
    pending: { label: "Wymaga weryfikacji", tone: "yellow" },
    draft: { label: "Szkic", tone: "gray" },
  };

  const renderStatusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    const t = statusTranslations[status] ?? { label: status, tone: "gray" };
    const toneClasses: Record<string, string> = {
      green: "bg-accent/10 text-accent-foreground",
      red: "bg-destructive/10 text-destructive",
      yellow: "bg-muted/10 text-muted-foreground",
      gray: "bg-muted/10 text-muted-foreground",
    };
    return <span className={`${base} ${toneClasses[t.tone]}`}>{t.label}</span>;
  };

  return (
    <Dialog open={isUserStatisticsModalOpen} onOpenChange={setIsUserStatisticsModalOpen}>
      <DialogContent className="max-h-[83vh] min-h-[83vh] md:min-w-[70vw] xl:min-w-[60vw] flex flex-col p-0 gap-0 rounded-xl shadow-xl bg-background overflow-hidden">
        {/* HEADER */}
        <DialogHeader className="flex items-start justify-between gap-4 border-b border-border px-6 py-3">
          <div className="flex items-start gap-4 min-w-0">
            {/* zamiast Avatar */}
            <div className="h-12 w-12 flex items-center justify-center rounded-md text-foreground bg-muted">
              <Edit3 className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <div className="mt-0.5 text-2xs text-muted-foreground">Lista artykułów edytowanych przez :</div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {selectedUser ? `${selectedUser.name ?? ""} ${selectedUser.surname ?? ""}`.trim() : "Użytkownik"}
                </h3>

                <div className=" text-xs text-muted-foreground truncate max-w-[48ch]">
                  {selectedUser?.email ?? `ID: ${selectedUser?.userId ?? "—"}`}
                </div>
              </div>
            </div>
          </div>

          <div aria-hidden className="w-6" />
        </DialogHeader>

        {/* --- filter range ---*/}
        <div className="px-6 py-2 text-xs text-muted-foreground border-b border-border bg-muted/30">
          Zakres dat:{" "}
          {startDate && endDate
            ? `${new Date(startDate).toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })} – ${new Date(endDate).toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}`
            : `${new Date().toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })} (dzisiaj)`}
        </div>

        {/* --- articles list ---*/}
        <div className="flex-grow flex overflow-hidden">
          <Card className="flex flex-grow flex-col w-full overflow-hidden border-none bg-transparent shadow-none">
            <CardContent className="flex flex-col flex-grow p-0 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center w-full h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : !data?.length ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                  <p className="text-sm">Brak dodanych artykułów w wybranym zakresie dat</p>
                </div>
              ) : (
                <ScrollArea className="w-full h-full">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted/40 sticky top-0 z-10">
                        <th className="text-left py-3 px-6 font-medium text-foreground">Tytuł</th>
                        <th className="text-left py-3 px-6 font-medium text-foreground">Produkt</th>

                        <th className="text-center py-3 px-6 font-medium text-foreground">Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((article: any) => (
                        <tr key={article._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-6 font-medium text-foreground text-xs max-w-[220px]">
                            <div className="truncate" title={article.title}>
                              {article.title}
                            </div>
                          </td>
                          <td className="py-3 px-6 text-foreground font-medium text-xs">{article.product?.name}</td>

                          <td className="py-3 px-6 text-right">
                            <div className="flex justify-center gap-3">
                              <a
                                href={`${import.meta.env.VITE_BACKEND_BASE_URL}/articles/${article._id}/history`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline font-medium text-xs"
                              >
                                Link do artykułu
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
