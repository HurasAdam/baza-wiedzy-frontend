import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { IProduct } from "@/types/product";
import { productSchema } from "@/validation/product.schema";
import { topicSchema } from "@/validation/topic.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { topicFormData } from "./topic-modal";

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

interface TopicFormProps {
  products: IProduct[];
  defaultValues: topicFormData;
  onSubmit: (data: topicFormData) => void;
  submitText?: string;
  isSubmitting?: boolean;
  productId?: string;
}

export const TopicForm = ({
  products,
  defaultValues,
  onSubmit,
  submitText = "Zapisz",
  isSubmitting = false,
  productId,
}: TopicFormProps) => {
  const form = useForm<topicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      ...defaultValues,
      product: productId ?? defaultValues.product,
    },
  });

  const isDirty = form.formState.isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produkt</FormLabel>
                <FormControl>
                  {productId ? (
                    <>
                      <input type="hidden" {...field} value={productId} />
                      <p className="text-sm text-muted-foreground">
                        {products.find((p) => p._id === productId)?.name ?? "Wybrany produkt"}
                      </p>
                    </>
                  ) : (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Wybierz produkt --" />
                      </SelectTrigger>
                      <SelectContent side="bottom">
                        {products?.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nazwa tematu" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Zapisywanie..." : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
