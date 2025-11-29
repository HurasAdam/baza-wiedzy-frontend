import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Volume } from "lucide-react";
import { useSound } from "../../providers/sound-provider";

export default function SettingsSoundPanel() {
  const { soundEnabled, setSoundEnabled } = useSound();

  return (
    <Card className="border-none shadow-none bg-transparent py-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-header-foreground">
          <Volume className="w-5 h-5 text-muted-foreground" />
          Efekty dźwiękowe
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tutaj możesz włączyć lub wyłączyć wszystkie efekty dźwiękowe w aplikacji (logowanie, wylogowanie, inne akcje).
        </p>
      </CardHeader>

      <CardContent className="flex items-center gap-4 mt-4">
        <Switch checked={soundEnabled} onCheckedChange={(checked: boolean) => setSoundEnabled(checked)} />
        <span className="text-sm text-muted-foreground">Włącz efekty dźwiękowe</span>
      </CardContent>
    </Card>
  );
}
