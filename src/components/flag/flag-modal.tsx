import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

// Predefiniowane kolory
export const colorOptions = [
  "#E53E3E", // Red
  "#3182CE", // Blue
  "#2F855A", // Green
  "#D69E2E", // Yellow
  "#6B46C1", // Purple
  "#DD6B20", // Orange
  "#38B2AC", // Teal
  "#4A5568", // Slate / Navy
];

// Schemat formularza
export const flagSchema = z.object({
  name: z.string().min(1, "Nazwa etykiety jest wymagana"),
  color: z.string().min(1, "Kolor etykiety jest wymagany"),
});

export type FlagForm = z.infer<typeof flagSchema>;

interface FlagModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (data: FlagForm) => void;
  isLoading: boolean;
}

export const FlagModal = ({ isOpen, setIsOpen, onSave, isLoading }: FlagModalProps) => {
  const form = useForm<FlagForm>({
    resolver: zodResolver(flagSchema),
    defaultValues: {
      name: "",
      color: colorOptions[0],
    },
  });

  const onSubmit = (data: FlagForm) => {
    onSave(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        {/* ===== Header ===== */}
        <div className="space-y-2 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/40">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>

            <DialogTitle className="text-lg font-semibold leading-none">Dodaj etykietę</DialogTitle>
          </div>

          <p className="text-sm text-muted-foreground max-w-[420px]">
            Etykiety pomagają oznaczać i filtrować ulubione artykuły, ułatwiając ich grupowanie.
          </p>
        </div>

        {/* ===== Form ===== */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-6">
            {/* Nazwa */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="np. Do przeczytania"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kolor */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kolor</FormLabel>
                  <FormControl>
                    <div className="flex gap-3 flex-wrap mt-2">
                      {colorOptions.map((color) => (
                        <button
                          type="button"
                          key={color}
                          onClick={() => field.onChange(color)}
                          className={cn(
                            "h-6 w-6 rounded-full transition-all",
                            "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                            field.value === color && "ring-2 ring-offset-2 ring-primary"
                          )}
                          style={{ backgroundColor: color }}
                          aria-label={`Wybierz kolor ${color}`}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer */}
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Anuluj
              </Button>

              <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Utwórz
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
