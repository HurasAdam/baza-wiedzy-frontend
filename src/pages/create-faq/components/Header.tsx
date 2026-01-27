import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface Props {
  onBack: () => void;
}

export const Header = ({ onBack }: Props) => {
  return (
    <header className="flex items-center gap-4 border-b border-border pb-4 mb-4">
      <Button
        variant="outline"
        className="w-16 h-16 hover:bg-muted/30 flex items-center justify-center rounded-lg bg-background"
        onClick={onBack}
      >
        <ArrowLeft className="w-8 h-8" />
      </Button>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold max-w-[740px] break-words text-foreground/95">Kreator FAQ</h1>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate max-w-[520px]">
            Zaprojektuj sekcję FAQ - nadaj jej tytuł, dobierz ikonę i przygotuj zestaw pytań dla użytkowników.
          </span>
        </div>
      </div>
    </header>
  );
};
