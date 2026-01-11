import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  canAddComment: boolean;
}

export function CommentFormSection({ value, onChange, onSubmit, loading, canAddComment }: Props) {
  return (
    <Card className="mt-6 shadow-sm border bg-card/70">
      <CardContent>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Dodaj komentarz</h3>

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            canAddComment ? "Wpisz komentarz do zgłoszenia..." : "Nie masz uprawnień do dodawania komentarzy"
          }
          className="resize-none min-h-[100px]"
          disabled={loading || !canAddComment}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              onSubmit();
            }
          }}
        />

        <div className="flex justify-end mt-3">
          <Button size="sm" onClick={onSubmit} disabled={loading || !canAddComment || !value.trim()}>
            Dodaj komentarz
          </Button>
        </div>
        {/* ⬇️ TU */}
        {!canAddComment && (
          <p className="mt-2 text-xs text-muted-foreground">Nie posiadasz uprawnień do dodawania komentarzy.</p>
        )}
      </CardContent>
    </Card>
  );
}
