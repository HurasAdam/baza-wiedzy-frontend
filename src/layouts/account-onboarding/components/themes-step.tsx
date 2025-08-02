import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const themes = [
  { id: "light", name: "Jasny", description: "Klasyczny jasny motyw" },
  { id: "dark", name: "Ciemny", description: "Tryb nocny, ciemne tło" },
  { id: "slate", name: "Slate", description: "Stonowany, chłodny odcień" },
  { id: "amber", name: "Amber", description: "Ciepły, pomarańczowy akcent" },
];

const themeSchema = z.object({
  selectedTheme: z.string().nonempty("Wybierz motyw"),
});

type ThemeFormData = z.infer<typeof themeSchema>;

interface ThemeStepProps {
  onBack: () => void;
  onFinish: (data: ThemeFormData) => void;
  isPending: boolean;
}

export const ThemeStep: React.FC<ThemeStepProps> = ({
  onBack,
  onFinish,
  isPending,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ThemeFormData>({
    resolver: zodResolver(themeSchema),
    mode: "onSubmit",
  });

  const selectedTheme = watch("selectedTheme");

  return (
    <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {themes.map((theme) => (
          <label
            key={theme.id}
            htmlFor={theme.id}
            className={`cursor-pointer rounded-lg border border-border p-4 flex flex-col gap-1
              ${
                selectedTheme === theme.id
                  ? "border-primary bg-primary/10"
                  : "hover:border-primary"
              } transition-colors`}
          >
            <Controller
              name="selectedTheme"
              control={control}
              render={({ field }) => (
                <input
                  type="radio"
                  id={theme.id}
                  value={theme.id}
                  checked={field.value === theme.id}
                  onChange={() => field.onChange(theme.id)}
                  className="hidden"
                />
              )}
            />
            <span className="font-semibold text-foreground">{theme.name}</span>
            <span className="text-muted-foreground text-sm">
              {theme.description}
            </span>
          </label>
        ))}
      </div>

      {errors.selectedTheme && (
        <p className="text-destructive text-sm text-center">
          {errors.selectedTheme.message}
        </p>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isPending}
          className="w-24"
        >
          Wstecz
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          className="w-24"
        >
          {isPending ? (
            <>
              <Loader className="animate-spin h-5 w-5" />
              Proszę czekać...
            </>
          ) : (
            "Zakończ"
          )}
        </Button>
      </div>
    </form>
  );
};
