import { ChartColumnDecreasing, Download, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { StatisticsFilterBar } from "./StatisticsFilterBar";

interface StatisticsHeaderProps {
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  onExport: () => void;
  isExportLoading: boolean;
}

const StatisticsHeader = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onExport,
  isExportLoading,
}: StatisticsHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between gap-4 mr-4">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-1.5">
          <ChartColumnDecreasing /> Statystyki użytkowników
        </h1>

        <Button onClick={onExport} size="sm" className="flex items-center gap-2 cursor-pointer">
          {isExportLoading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Eksportuj
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Eksportuj
            </>
          )}
        </Button>
      </div>
      <StatisticsFilterBar
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <div className="text-sm text-muted-foreground mt-2 mb-4.5 pt-6">
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
