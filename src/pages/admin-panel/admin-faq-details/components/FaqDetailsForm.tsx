import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "../../../../components/ui/textarea";
import { COLORS, COLOR_TOKEN_MAP, ICONS } from "../../../../constants/faq-icons";

export const FaqDetailsForm = () => {
  const { register, watch, setValue, getValues } = useFormContext();
  const selectedColor = watch("labelColor");
  const selectedIcon = watch("iconKey");
  const description = watch("description") || "";

  const iconKeys = Object.keys(ICONS);

  // setting default Icon
  useEffect(() => {
    const currentIcon = getValues("iconKey");
    if (!currentIcon && iconKeys.length > 0) {
      setValue("iconKey", iconKeys[0], { shouldDirty: false });
    }
  }, [getValues, setValue, iconKeys]);

  const getColorVar = (key: string) => COLOR_TOKEN_MAP[key] || COLOR_TOKEN_MAP.gray;

  return (
    <form>
      <input type="hidden" {...register("labelColor")} />
      <input type="hidden" {...register("iconKey")} />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-header-foreground">Tytuł:</label>
        <Input {...register("title")} placeholder="Wpisz tytuł FAQ" className="h-10 text-foreground border-ring" />
      </div>

      {/* --- description --- */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1 text-header-foreground">Opis:</label>
        <Textarea
          {...register("description", { maxLength: 1500 })}
          placeholder="Wpisz opis FAQ (opcjonalnie). Możesz użyć do 1500 znaków."
          className="w-full min-h-[6rem] p-3 rounded-md border-ring bg-card text-foreground placeholder:text-muted-foreground resize-vertical"
        />
        <div className="flex justify-end text-xs text-muted-foreground mt-1">
          <span>{description.length}/1500</span>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1 text-header-foreground">Kolor etykiety:</label>
        <div className="flex space-x-2">
          {COLORS.map((color) => {
            const active = selectedColor === color;
            return (
              <button
                key={color}
                type="button"
                aria-pressed={active}
                title={color}
                onClick={() => setValue("labelColor", color, { shouldDirty: true })}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform"
                style={{
                  backgroundColor: getColorVar(color),
                  borderColor: active ? "transparent" : "var(--color-border)",
                  boxShadow: active ? `0 0 0 4px var(--color-ring)` : undefined,
                  transform: active ? "scale(1.06)" : undefined,
                }}
              >
                {active && <Check className="w-3 h-3" style={{ color: "var(--color-primary-foreground)" }} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1 text-header-foreground">Ikona FAQ:</label>
        <div className="flex flex-wrap gap-2">
          {iconKeys.map((key) => {
            const Icon = ICONS[key];
            const active = selectedIcon === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setValue("iconKey", key, { shouldDirty: true })}
                className={`relative w-10 h-10 p-1 rounded-md border flex items-center justify-center transition ${
                  active
                    ? "bg-primary text-primary-foreground ring-2 ring-primary border-border"
                    : "bg-card text-foreground border-border"
                } hover:scale-105`}
                title={key}
              >
                <Icon className="w-5 h-5" />
                {active && <Check className="absolute w-4 h-4 top-0 right-0 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </form>
  );
};
