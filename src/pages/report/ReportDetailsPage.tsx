import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFindIssueReportQuery } from "@/hooks/issue-report/use-issue-report";
import { ArrowLeft, Bug, Calendar, Lightbulb, Loader, MoreVertical, Tag, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Oczekujące";
    case "in-progress":
      return "W trakcie";
    case "resolved":
      return "Rozwiązane";
    case "rejected":
      return "Odrzucone";
    default:
      return status;
  }
};

const typeLabels: Record<string, string> = {
  bug: "Błąd",
  proposal: "Propozycja",
};

export function ReportDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: report, isLoading } = useFindIssueReportQuery(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  if (!report) {
    return <p className="text-center py-20 text-muted-foreground">Nie znaleziono zgłoszenia</p>;
  }

  return (
    <div className="mx-auto max-w-[1400px] h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Powrót
          </Button>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{report.title}</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>ID: {report._id}</span> • <span>Typ: {typeLabels[report.type]}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Status: {getStatusLabel(report.status)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.keys(statusColors).map((status) => (
                <DropdownMenuItem key={status}>{getStatusLabel(status)}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edytuj</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Usuń</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Lewa karta 1 */}
        <Card className="md:col-span-2 shadow-sm border bg-card/70">
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Opis zgłoszenia</h2>
            <p className="text-[15.5px] whitespace-pre-wrap break-words text-foreground/90">
              Pozwoliłem sobie zweryfikować sytuację na Państwa koncie i zauważyłem, że do Państwa Konta LIBRUS zostały
              powiązane konta LIBRUS Synergia dla dwójki dzieci...
            </p>
            <br></br>
            <p>
              Jeśli jednak dokonali Państwo opłaty za każde z kont, a usługa jest aktywna tylko na jednym (lub nie jest
              dostępna na żadnym z kont), proszę o przesłanie odpowiedniego potwierdzenia zakupu dla każdej z
              transakcji, w zależności od miejsca zakupu:
            </p>
          </CardContent>
        </Card>

        {/* 🔥 Prawa karta – MUSI być tutaj */}
        <Card className="md:col-span-1 md:row-span-2 shadow-sm border bg-card/70">
          <CardContent className="flex flex-col gap-6">
            {[
              {
                label: "Typ",
                icon:
                  report.type === "bug" ? (
                    <Bug className="w-4 h-4 text-red-500" />
                  ) : (
                    <Lightbulb className="w-4 h-4 text-blue-500" />
                  ),
                value: typeLabels[report.type],
              },
              {
                label: "Status",
                icon: <Loader className="w-4 h-4 text-muted-foreground" />,
                value: <Badge className={statusColors[report.status]}>{getStatusLabel(report.status)}</Badge>,
              },

              {
                label: "Kategoria",
                icon: <Tag className="w-4 h-4 text-purple-500" />,
                value: report.category,
              },
              {
                label: "Utworzone przez",
                icon: <Users className="w-4 h-4 text-gray-500" />,
                value: `${report.createdBy.name} ${report.createdBy.surname}`,
              },
              {
                label: "Data utworzenia",
                icon: <Calendar className="w-4 h-4 text-gray-500" />,
                value: new Date(report.createdAt).toLocaleString("pl-PL"),
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.icon}
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{item.label}</h3>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lewa karta 2 */}
        <Card className="md:col-span-2 shadow-sm border bg-card/70">
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Szczegóły</h2>
            <p className="text-[15.5px] whitespace-pre-wrap break-words text-foreground/90">{report.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
