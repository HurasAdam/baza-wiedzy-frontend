import { Card, CardContent } from "../../../../components/ui/card";

interface Props {
  employeeDescription: string;
}

export const ArticleEmployeeNotes = ({ employeeDescription }: Props) => {
  return (
    <Card className="shadow-sm border bg-card/70">
      <CardContent>
        <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold">
          {/* Pasek akcentujący */}
          <span className="w-1.5 h-6 bg-primary/20 rounded-full flex-shrink-0"></span>

          {/* Ikona info */}

          <span className="leading-snug">
            Opis i wskazówki <span className="text-xs text-muted-foreground">(dla pracownika)</span>
          </span>
        </h2>
        <p className="text-[15.5px] whitespace-pre-wrap break-words text-foreground">{employeeDescription}</p>
      </CardContent>
    </Card>
  );
};
