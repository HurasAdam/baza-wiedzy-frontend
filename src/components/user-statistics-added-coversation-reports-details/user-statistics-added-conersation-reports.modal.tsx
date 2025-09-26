import { ArcElement, Chart as ChartJS, Legend, Tooltip, type TooltipItem } from "chart.js";
import { ClipboardList } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { useFindUserAddedConversationReports } from "../../hooks/user-statistics/user-user-statistics";
import type { SelectedUser } from "../../pages/statistics/StatisticsPage";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieSlice {
  name: string;
  value: number;
  color: string;
}

interface UserStatisticsAddedConversationReportsModalProps {
  selectedUser: SelectedUser | null;
  isUserStatisticsModalOpen: boolean;
  setIsUserStatisticsModalOpen: (isOpen: boolean) => void;
  startDate?: Date;
  endDate?: Date;
}

interface ConversationReportDTO {
  name?: string | null;
  count?: number | null;
  labelColor?: string | null;
}

export const UserStatisticsAddedConversationReportsModal = ({
  selectedUser,
  isUserStatisticsModalOpen,
  setIsUserStatisticsModalOpen,
  startDate,
  endDate,
}: UserStatisticsAddedConversationReportsModalProps) => {
  const userId = selectedUser?.userId ?? null;
  const params = { userId, startDate, endDate };
  const { data: conversationReports } = useFindUserAddedConversationReports(params);

  const pieData: PieSlice[] = (conversationReports ?? [])
    .filter(
      (item): item is ConversationReportDTO => !!item && typeof item.name === "string" && typeof item.count === "number"
    )
    .map((item) => ({
      name: item.name,
      value: item.count,
      color: item.labelColor ?? "#999999", // fallback na szary kolor
    }));

  console.log(selectedUser, "JUZER");
  const totalTopics = pieData.reduce((sum, d) => sum + d.value, 0);

  const data = {
    labels: pieData.map((d) => d.name),
    datasets: [
      {
        data: pieData.map((d) => d.value),
        backgroundColor: pieData.map((d) => d.color),
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"doughnut">) => {
            const value = tooltipItem.raw as number;
            return `${tooltipItem.label}: ${value} zgłoszeń`;
          },
        },
      },
    },
    cutout: "55%",
  };

  return (
    <Dialog open={isUserStatisticsModalOpen} onOpenChange={setIsUserStatisticsModalOpen} modal>
      <DialogContent className="max-h-[83vh] min-h-[83vh] md:min-w-[70vw] xl:min-w-[60vw] flex flex-col p-0 gap-0">
        <DialogHeader className="flex flex-col gap-2 border-b border-border px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-md text-foreground bg-muted">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-foreground truncate">
                {selectedUser
                  ? `Statystyki odnotowanych tematów użytkownika ${selectedUser.name ?? ""} ${
                      selectedUser.surname ?? ""
                    }`
                  : "Statystyki rozmów użytkownika — według produktów"}
              </h2>
              <p className="text-xs text-muted-foreground truncate max-w-[48ch]">
                {selectedUser?.email ?? `ID: ${selectedUser?.userId ?? "—"}`}
              </p>
            </div>
          </div>
        </DialogHeader>

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

        <div className="flex-grow flex overflow-hidden">
          <Card className="flex flex-grow bg-background rounded-lg shadow-md overflow-hidden">
            <CardContent className="flex flex-col md:flex-row flex-grow h-full p-6 gap-6">
              {/* Doughnut chart */}
              <div className="flex-1 flex items-center justify-center max-h-full">
                <Doughnut data={data} options={options} />
              </div>

              {/* Legend */}
              <aside className="w-full md:w-1/3 flex flex-col justify-start gap-4 p-4 bg-muted/10 rounded-lg">
                <CardTitle className="text-sm font-semibold mb-2">Legenda</CardTitle>

                <div className="flex items-center justify-between text-sm font-medium mb-2">
                  <span>Łącznie tematów:</span>
                  <span>{totalTopics}</span>
                </div>

                <ul className="space-y-2">
                  {pieData.map((d) => (
                    <li key={d.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-4 h-4 rounded-sm" style={{ background: d.color }} />
                        <span>{d.name}</span>
                      </div>
                      <span className="font-medium">{d.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto text-xs text-muted-foreground">
                  Prezentowane dane przedstawiają liczbę odnotowanych tematów, pogrupowanych według produktów.
                </div>
              </aside>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
