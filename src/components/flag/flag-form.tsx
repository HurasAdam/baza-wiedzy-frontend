import { Loader, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import type { FlagForm } from "./flag-modal";

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

interface FlagFormProps {
  onSubmit: (data: FlagForm) => void;
  isSaving: boolean;
  onClose: () => void;
  defaultValues: FlagForm;
}

const FlagForm = ({ defaultValues, onSubmit, isSaving = false, onClose }: FlagFormProps) => {
  const form = useForm<FlagForm>({
    defaultValues,
    mode: "onChange",
  });

  const handleClose = () => {
    form.reset(defaultValues); // reset do wartości domyślnych
    onClose();
  };

  return (
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
          <Button type="button" variant="ghost" onClick={handleClose}>
            Anuluj
          </Button>
          <Button disabled={isSaving} type="submit" className="flex items-center gap-2">
            {isSaving ? <Loader className="w-4 h-4 animate-spin " /> : <Save className="w-4 h-4" />}
            Zapisz
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default FlagForm;
