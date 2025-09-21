import { format as formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date?: Date) => void;
  disabledDate?: (date: Date) => boolean; // nowa props
}

export function DatePicker({ date, onDateChange, disabledDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon />
          {date ? formatDate(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          disabled={disabledDate} // tutaj wykorzystujemy przekazaną funkcję
        />
      </PopoverContent>
    </Popover>
  );
}
