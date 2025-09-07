import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { productSchema } from "@/validation/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export const colorOptions = [
  "#C94C4C", // ciepła, zgaszona czerwień
  "#2EA9A1", // stonowany teal
  "#3EA549", // średnia zieleń
  "#D9A32A", // złoto / musztardowy
  "#E07A2E", // ciepły pomarańcz
  "#274872", // głęboki granat
  "#4B6CB7", // umiarkowany niebieski
  "#7D5BA6", // stonowany fiolet
  "#6B8E23", // oliwkowa zieleń
  "#6B7280", // neutralny slate / szary
  "#E27D7D", // pastelowy koral
  "#2BB3C0", // jasny cyan / morski
];

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  submitText?: string;
  isSubmitting?: boolean;
}

export const ProductForm = ({
  defaultValues,
  onSubmit,
  submitText = "Zapisz",
  isSubmitting = false,
}: ProductFormProps) => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const isDirty = form.formState.isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 ">
        {/* Nazwa produktu */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa</FormLabel>
              <FormControl>
                <Input className="border-ring" {...field} placeholder="Nazwa produktu" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kolor etykiety */}
        <FormField
          control={form.control}
          name="labelColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kolor etykiety</FormLabel>
              <FormControl>
                <div className="flex gap-3 flex-wrap mb-1.5">
                  {colorOptions.map((color) => (
                    <div
                      key={color}
                      onClick={() => field.onChange(color)}
                      className={cn(
                        "w-6 h-6 rounded-sm cursor-pointer hover:opacity-80 transition-all duration-300",
                        field.value === color && "ring-2 ring-offset-2 ring-blue-500"
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

        <div className="flex justify-end ">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Zapisywanie..." : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
