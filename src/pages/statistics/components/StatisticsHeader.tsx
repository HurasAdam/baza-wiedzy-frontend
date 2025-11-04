import { ChartColumnDecreasing } from "lucide-react";
import { StatisticsFilterBar } from "./StatisticsFilterBar";

interface StatisticsHeaderProps {
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
}

const StatisticsHeader = ({ startDate, endDate, setStartDate, setEndDate }: StatisticsHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-1.5">
          <ChartColumnDecreasing /> Statystyki użytkowników
        </h1>

        <StatisticsFilterBar
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </div>

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
    </>
  );
};

export default StatisticsHeader;
