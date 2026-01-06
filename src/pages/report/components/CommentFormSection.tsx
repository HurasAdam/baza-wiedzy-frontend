import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function CommentFormSection({ value, onChange, onSubmit, loading }: Props) {
  return (
    <Card className="mt-6 shadow-sm border bg-card/70">
      <CardContent>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Dodaj komentarz</h3>

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Wpisz komentarz do zgłoszenia..."
          className="resize-none min-h-[100px]"
          disabled={loading}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              onSubmit();
            }
          }}
        />

        <div className="flex justify-end mt-3">
          <Button size="sm" onClick={onSubmit} disabled={loading || !value.trim()}>
            Dodaj komentarz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
