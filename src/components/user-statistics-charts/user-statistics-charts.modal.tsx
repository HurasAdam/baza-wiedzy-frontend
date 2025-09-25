import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieSlice {
  name: string;
  value: number;
  color: string;
}

interface UserStatisticsChartsModalProps {
  isUserStatisticsModalOpen: boolean;
  setIsUserStatisticsModalOpen: (isOpen: boolean) => void;
}

const fakeData: PieSlice[] = [
  { name: "Produkt A", value: 45, color: "#6366F1" },
  { name: "Produkt B", value: 25, color: "#06B6D4" },
  { name: "Produkt C", value: 15, color: "#F59E0B" },
  { name: "Inne", value: 15, color: "#EF4444" },
];

export const UserStatisticsChartsModal = ({
  isUserStatisticsModalOpen,
  setIsUserStatisticsModalOpen,
}: UserStatisticsChartsModalProps) => {
  const data = {
    labels: fakeData.map((d) => d.name),
    datasets: [
      {
        data: fakeData.map((d) => d.value),
        backgroundColor: fakeData.map((d) => d.color),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          // Tylko nazwy, bez wartości
          generateLabels: (chart: any) =>
            chart.data.labels.map((label: string, i: number) => ({
              text: label,
              fillStyle: chart.data.datasets[0].backgroundColor[i],
              index: i,
            })),
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            // pokaż wartość dopiero w tooltipie po hover
            const value = tooltipItem.raw;
            return `${tooltipItem.label}: ${value} rozmów`;
          },
        },
      },
    },
  };

  return (
    <Dialog open={isUserStatisticsModalOpen} onOpenChange={setIsUserStatisticsModalOpen} modal>
      <DialogContent className="max-h-[83vh] min-h-[60vh] min-w-[88vw] md:min-w-[75vw] xl:min-w-[62vw] flex flex-col p-0 gap-0">
        <DialogHeader className="flex-shrink-0 border-b py-3 px-4">
          <DialogTitle className="text-lg font-semibold">Wykresy — odnotowane tematy rozmów</DialogTitle>
        </DialogHeader>

        <div className="flex-grow flex overflow-hidden">
          <Card className="flex flex-grow bg-background rounded-lg shadow-md overflow-hidden">
            <CardContent className="flex flex-col md:flex-row flex-grow h-full p-6 gap-6">
              {/* Doughnut chart */}
              <div className="flex-1 flex items-center justify-center min-h-[350px]">
                <Doughnut data={data} options={options} />
              </div>

              {/* Legend / description */}
              <aside className="w-full md:w-1/3 flex flex-col justify-start gap-4 p-4 bg-muted/10 rounded-lg">
                <CardTitle className="text-sm font-semibold mb-2">Legenda</CardTitle>
                <ul className="space-y-2">
                  {fakeData.map((d) => (
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
                  Dane przykładowe — zastąp prawdziwymi danymi po stronie serwera.
                </div>
              </aside>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
