import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ChartColumnDecreasing, Edit3, FileText, Loader, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { NoDataFound } from "../../components/shared/NoDataFound";
import { Button } from "../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { useFindAllUsersStatistics } from "../../hooks/user-statistics/user-user-statistics";
import { DateFilterBar } from "./components/DateFilterBar";

export const StatisticsPage = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const hasFilters = startDate && endDate;
  const params = hasFilters ? { startDate, endDate } : undefined;
  const { data, isLoading } = useFindAllUsersStatistics(params);

  const renderUserCell = (u: unknown) => (
    <div className="flex items-center gap-3.5">
      <Avatar className="h-9 w-9">
        <AvatarImage src={u.avatarUrl || ""} alt={`${u.name} ${u.surname}`} />
        <AvatarFallback>
          {u.name?.[0]}
          {u.surname?.[0]}
        </AvatarFallback>
      </Avatar>
      <span>
        {u.name} {u.surname}
      </span>
    </div>
  );

  const ActionsCell = ({ user }: { user: any }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2 space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            Szczegóły
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Historia
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Wiadomość
          </Button>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-1.5">
          <ChartColumnDecreasing /> Statystyki użytkowników
        </h1>

        <DateFilterBar startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
      </div>

      {/* Informacja o zakresie dat – pod paskiem filtrów */}
      <div className="text-sm text-muted-foreground mt-2 mb-4">
        {startDate && endDate ? (
          <p>
            Wyświetlane statystyki od <strong>{startDate.toLocaleDateString()}</strong> do{" "}
            <strong>{endDate.toLocaleDateString()}</strong>
          </p>
        ) : (
          <p>
            Wyświetlane statystyki za <strong>dzisiejszy dzień</strong>
          </p>
        )}
      </div>

      {/* Tables */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-7 h-7 animate-spin" />
        </div>
      ) : !data?.length ? (
        <NoDataFound
          title="No data"
          description="Pick a start and end date to view statistics"
          buttonText="Pick Date"
          buttonAction={() => {}}
        />
      ) : (
        <div className="space-y-6">
          {/* Dodane artykuły */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Dodane artykuły
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Użytkownik</th>
                    <th className="text-left py-2">Wartość</th>
                    <th className="text-center py-2">Akcje</th> {/* <--- nowa kolumna */}
                  </tr>
                </thead>
                <tbody>
                  {[...data]
                    .sort((a, b) => b.stats.articlesAdded - a.stats.articlesAdded) // sortowanie po dodanych artykułach
                    .map((u) => (
                      <tr key={u.userId} className="border-b hover:bg-muted/50">
                        <td className="py-2">{renderUserCell(u)}</td>
                        <td className="py-2">{u.stats.articlesAdded}</td> {/* <--- tutaj zmienione */}
                        <td className="py-2 text-center">
                          <ActionsCell user={u} /> {/* <--- nowe pole */}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Edytowane artykuły */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-primary" />
                Edytowane artykuły
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Użytkownik</th>
                    <th className="text-left py-2">Wartość</th>
                    <th className="text-center py-2">Akcje</th> {/* <--- nowa kolumna */}
                  </tr>
                </thead>
                <tbody>
                  {[...data]
                    .sort((a, b) => b.stats.articlesEdited - a.stats.articlesEdited)
                    .map((u) => (
                      <tr key={u.userId} className="border-b hover:bg-muted/50">
                        <td className="py-2">{renderUserCell(u)}</td>
                        <td className="py-2">{u.stats.articlesEdited}</td>
                        <td className="py-2 text-center">
                          <ActionsCell user={u} /> {/* <--- nowe pole */}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Odnotowane rozmowy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Odnotowane rozmowy i wiadomości
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Użytkownik</th>
                    <th className="text-left py-2">Wartość</th>
                    <th className="text-center py-2">Akcje</th> {/* <--- nowa kolumna */}
                  </tr>
                </thead>
                <tbody>
                  {[...data]
                    .sort((a, b) => b.stats.conversationTopics - a.stats.conversationTopics)
                    .map((u) => (
                      <tr key={u.userId} className="border-b hover:bg-muted/50">
                        <td className="py-2">{renderUserCell(u)}</td>
                        <td className="py-2">{u.stats.conversationTopics}</td>
                        <td className="py-2 text-center">
                          <ActionsCell user={u} /> {/* <--- nowe pole */}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
