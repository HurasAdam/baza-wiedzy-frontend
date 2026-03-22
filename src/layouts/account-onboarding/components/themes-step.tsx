import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";
import { ArrowRight, Loader } from "lucide-react";
import React from "react";

const THEMES = [
  { key: "light", label: "Light · Claude", colors: ["#c96442", "#e9e6dc", "#dad9d4", "#b4b2a7"] },
  { key: "dark-claude", label: "Dark · Claude", colors: ["#d97757", "#1b1b19", "#faf9f5", "#363636"] },
  { key: "light-caffeine", label: "Light · Caffeine", colors: ["#c1a875", "#f1ede1", "#e5e1d5", "#e5e7eb"] },
  { key: "dark-caffeine", label: "Dark · Caffeine", colors: ["#d4bc8b", "#2d2b28", "#262626", "#f8f7f2"] },
  { key: "light-catppuccin", label: "Light · Catppuccin", colors: ["#8839ef", "#04a5e5", "#ccd0da", "#bcc0cc"] },
  { key: "dark-catppuccin", label: "Dark · Catppuccin", colors: ["#cba6f7", "#89dceb", "#585b70", "#292c3c"] },
  { key: "light-darkmatter", label: "Light · Darkmatter", colors: ["#d87943", "#eeeeee", "#527575", "#e5e7eb"] },
  { key: "dark-darkmatter", label: "Dark · Darkmatter", colors: ["#e78a53", "#222222", "#5f8787", "#434343"] },
  { key: "light-classy", label: "Light · Darkmatter-fork", colors: ["#d87943", "#eeeeee", "#527575", "#e5e7eb"] },
  { key: "dark-classy", label: "Dark · Darkmatter-fork", colors: ["#e78a53", "#222222", "#5f8787", "#434343"] },
  { key: "light-supabase", label: "Light · Supabase", colors: ["#72e3ad", "#ededed", "#fdfdfd", "#dfdfdf"] },
  { key: "dark-supabase", label: "Dark · Supabase", colors: ["#006239", "#313131", "#242424", "#292929"] },
  { key: "light-cosmic", label: "Light · Cosmic", colors: ["#6e56cf", "#d8e6ff", "#e4dfff", "#e0e0f0"] },
  { key: "dark-cosmic", label: "Dark · Cosmic", colors: ["#a48fff", "#2d2b55", "#303060", "#222244"] },
  { key: "light-sage", label: "Light · Sage", colors: ["#7c9082", "#ced4bf", "#bfc9bb", "#e8e6e1"] },
  { key: "dark-sage", label: "Dark · Sage", colors: ["#7c9082", "#36443a", "#1a1a1a", "#2a2a2a"] },
  { key: "light-luxury", label: "Light · Luxury", colors: ["#9b2c2c", "#fef3c7", "#f5e8d2", "#f0ebe8"] },
  { key: "dark-luxury", label: "Dark · Luxury", colors: ["#b91c1c", "#b45309", "#92400e", "#44403c"] },
  { key: "light-perpetuity", label: "Light · Perpetuity", colors: ["#06858e", "#c9e5e7", "#d9eaea", "#cde0e2"] },
  { key: "dark-perpetuity", label: "Dark · Perpetuity", colors: ["#4de8e8", "#164955", "#0f3039", "#0e383c"] },
  { key: "light-twitter", label: "Light · Twitter", colors: ["#1da1f2", "#e1eaef", "#0f1419", "#E3ECF6"] },
  { key: "dark-twitter", label: "Dark · Twitter", colors: ["#1c9cf0", "#061622", "#d9d9d9", "#17181c"] },
  { key: "light-bloom", label: "Light · Bloom", colors: ["#7033ff", "#f5f8fb", "#e7e7ee", "#edf0f4"] },
  { key: "dark-bloom", label: "Dark · Bloom", colors: ["#8c5cff", "#1e293b", "#2a2c33", "#33353a"] },
  { key: "light-slack", label: "Light · Slack", colors: ["#611c69", "#e0215b", "#f4f0f7", "#edf0f4"] },
  { key: "dark-slack", label: "Dark · Slack", colors: ["#a559a5", "#e0215b", "#2a2e33", "#1a1d22"] },
  { key: "dark-violet", label: "Dark · Violet", colors: ["#6e56cf", "#313131", "#242424", "#292929"] },
  { key: "dark-aqua", label: "Dark · Aqua", colors: ["#3b82f6", "#313131", "#242424", "#292929"] },
  { key: "dark-halloween", label: "Dark · Halloween", colors: ["#cb4b16", "#313131", "#242424", "#292929"] },
] as const;

interface ThemeStepProps {
  onBack?: () => void;
  onFinish: (data: { selectedTheme: string }) => void;
  isPending: boolean;
}

export const ThemeStep: React.FC<ThemeStepProps> = ({ onBack, onFinish, isPending }) => {
  const { theme, setTheme } = useTheme();

  const handleSelect = (key: string) => setTheme(key);
  const handleSubmit = () => onFinish({ selectedTheme: theme });

  return (
    <div className="space-y-6 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] py-0.5 overflow-y-auto scrollbar-custom">
        {THEMES.map((t) => (
          <div
            key={t.key}
            className={`cursor-pointer border rounded-lg p-4 flex flex-col gap-2 transition-shadow  ${
              theme === t.key ? "border-primary shadow-lg bg-primary/10" : "hover:border-primary hover:shadow-sm"
            }`}
            onClick={() => handleSelect(t.key)}
          >
            <div className="flex gap-1 mb-2">
              {t.colors.map((c, i) => (
                <span key={i} className="w-6 h-6 rounded-sm" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="font-semibold text-foreground">{t.label}</span>
          </div>
        ))}
      </div>
      {/* Separator */}
      <hr className="border-t w-[98%] mx-auto" />
      <div className="flex justify-end mt-4">
        <Button variant="outline" onClick={handleSubmit} disabled={isPending} className="w-24">
          {isPending ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Proszę czekać...
            </>
          ) : (
            <>
              Dalej <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
