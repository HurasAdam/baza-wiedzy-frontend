import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/validation/product.schema";
import type { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const colorOptions = [
  "#FF5733",
  "#33C1FF",
  "#28A745",
  "#FFC300",
  "#8E44AD",
  "#E67E22",
  "#2ECC71",
  "#D72631",
  "#1B998B",
  "#F4D35E",
  "#4A90E2",
  "#F08A5D",
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
                <Input {...field} placeholder="Nazwa produktu" />
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
                        field.value === color &&
                          "ring-2 ring-offset-2 ring-blue-500"
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
