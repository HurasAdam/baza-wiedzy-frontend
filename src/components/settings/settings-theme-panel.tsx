import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/providers/theme-provider";
import { Palette } from "lucide-react";

const THEMES = [
  // CLAUDE
  {
    key: "light",
    label: "Light · Claude",
    colors: ["#c96442", "#e9e6dc", "#dad9d4", "#b4b2a7"],
  },
  {
    key: "dark-claude",
    label: "Dark · Claude",
    colors: ["#d97757", "#1b1b19", "#faf9f5", "#363636"],
  },

  // AMBER
  {
    key: "light-amber",
    label: "Light · Amber",
    colors: ["#f59e0b", "#fffbeb", "#f3f4f6", "#e5e7eb"],
  },
  {
    key: "dark-amber",
    label: "Dark · Amber",
    colors: ["#f59e0b", "#92400e", "#262626", "#434343"],
  },

  // CATPPUCCIN
  {
    key: "light-catppuccin",
    label: "Light · Catppuccin",
    colors: ["#8839ef", "#04a5e5", "#ccd0da", "#bcc0cc"],
  },
  {
    key: "dark-catppuccin",
    label: "Dark · Catppuccin",
    colors: ["#cba6f7", "#89dceb", "#585b70", "#292c3c"],
  },

  // DARKMATTER
  {
    key: "light-darkmatter",
    label: "Light · Darkmatter",
    colors: ["#d87943", "#eeeeee", "#527575", "#e5e7eb"],
  },
  {
    key: "dark-darkmatter",
    label: "Dark · Darkmatter",
    colors: ["#e78a53", "#222222", "#5f8787", "#434343"],
  },

  // SUPABASE
  {
    key: "light-supabase",
    label: "Light · Supabase",
    colors: ["#72e3ad", "#ededed", "#fdfdfd", "#dfdfdf"],
  },
  {
    key: "dark-supabase",
    label: "Dark · Supabase",
    colors: ["#006239", "#313131", "#242424", "#292929"],
  },

  // COSMIC
  {
    key: "light-cosmic",
    label: "Light · Cosmic",
    colors: ["#6e56cf", "#d8e6ff", "#e4dfff", "#e0e0f0"],
  },
  {
    key: "dark-cosmic",
    label: "Dark · Cosmic",
    colors: ["#a48fff", "#2d2b55", "#303060", "#222244"],
  },

  // SAGE
  {
    key: "light-sage",
    label: "Light · Sage",
    colors: ["#7c9082", "#ced4bf", "#bfc9bb", "#e8e6e1"],
  },
  {
    key: "dark-sage",
    label: "Dark · Sage",
    colors: ["#7c9082", "#36443a", "#1a1a1a", "#2a2a2a"],
  },

  // LUXURY
  {
    key: "light-luxury",
    label: "Light · Luxury",
    colors: ["#9b2c2c", "#fef3c7", "#f5e8d2", "#f0ebe8"],
  },
  {
    key: "dark-luxury",
    label: "Dark · Luxury",
    colors: ["#b91c1c", "#b45309", "#92400e", "#44403c"],
  },

  // DARK VIOLET / AQUA / HALLOWEEN
  {
    key: "dark-violet",
    label: "Dark · Violet",
    colors: ["#6e56cf", "#313131", "#242424", "#292929"],
  },
  {
    key: "dark-aqua",
    label: "Dark · Aqua",
    colors: ["#3b82f6", "#313131", "#242424", "#292929"],
  },
  {
    key: "dark-halloween",
    label: "Dark · Halloween",
    colors: ["#cb4b16", "#313131", "#242424", "#292929"],
  },
] as const;

const SettingsThemePanelTab = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Card className="border-none shadow-none bg-transparent py-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-header-foreground">
            <Palette className="w-5 h-5 text-muted-foreground" />
            Wygląd
          </CardTitle>
          <p className="text-sm text-muted-foreground">Wybierz motyw interfejsu</p>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border bg-input/30">
            <span className="text-sm font-medium text-muted-foreground">Motyw</span>

            <Select value={theme} onValueChange={(v) => setTheme(v as any)}>
              <SelectTrigger className="w-64 bg-background">
                <SelectValue placeholder="Wybierz motyw" />
              </SelectTrigger>

              <SelectContent className="max-h-[54vh] overflow-auto scrollbar-custom">
                {THEMES.map((t) => (
                  <SelectItem key={t.key} value={t.key}>
                    <div className="flex items-center gap-2">
                      {/* mini paleta kolorów */}
                      <div className="flex gap-1">
                        {t.colors.map((c, i) => (
                          <span key={i} className="w-3 h-3 rounded-[4px]" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span>{t.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsThemePanelTab;
