import { DatePicker } from "../../../components/shared/DatePicker";
import { Button } from "../../../components/ui/button";
interface StatisticsFilterBarProps {
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date?: Date) => void;
  setEndDate: (date?: Date) => void;
}

export const StatisticsFilterBar = ({ startDate, endDate, setStartDate, setEndDate }: StatisticsFilterBarProps) => {
  const disableStartDate = (date: Date) => (endDate ? date > endDate : false);
  const disableEndDate = (date: Date) => (startDate ? date < startDate : false);

  return (
    <div className="flex gap-2 items-end">
      <div>
        <span className="block text-xs mb-1 text-muted-foreground">Od</span>
        <DatePicker date={startDate} onDateChange={setStartDate} disabledDate={disableStartDate} />
      </div>

      <div>
        <span className="block text-xs mb-1 text-muted-foreground">Do</span>
        <DatePicker
          date={endDate}
          onDateChange={setEndDate}
          disabledDate={disableEndDate} // date blocker prop
        />
      </div>

      <Button
        size="default"
        variant={!startDate && !endDate ? "ghost" : "default"}
        onClick={() => {
          setStartDate(undefined);
          setEndDate(undefined);
        }}
        disabled={!startDate && !endDate}
      >
        Wyczyść
      </Button>
    </div>
  );
};
