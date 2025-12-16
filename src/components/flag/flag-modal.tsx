import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
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

// Schemat dla formularza flagi
export const flagSchema = z.object({
  name: z.string().min(1, "Nazwa flagi jest wymagana"),
  color: z.string().min(1, "Kolor flagi jest wymagany"),
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
        <DialogHeader>
          <DialogTitle>Dodaj etykietę</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Nazwa flagi */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="Nazwa etykiety"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Wybór koloru */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kolor</FormLabel>
                  <FormControl>
                    <div className="flex gap-3 flex-wrap mt-1">
                      {colorOptions.map((color) => (
                        <div
                          key={color}
                          onClick={() => field.onChange(color)}
                          className={cn(
                            "w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300",
                            field.value === color && "ring-2 ring-offset-2 ring-primary"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stopka z przyciskami */}
            <DialogFooter className="justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Anuluj
              </Button>
              <Button disabled={isLoading} type="submit" className="flex items-center gap-2">
                {isLoading ? <Loader className="w-4 h-4 animate-spin " /> : <Save className="w-4 h-4" />}
                Utwórz
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
