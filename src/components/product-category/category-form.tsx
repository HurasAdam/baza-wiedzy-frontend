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
import {
  productCategorySchema,
  type ProductCategoryFormData,
} from "@/validation/product-category.schema";

export type ProductFormData = z.infer<typeof productSchema>;

interface CategoryFormProps {
  defaultValues: ProductCategoryFormData;
  onSubmit: (data: ProductCategoryFormData) => void;
  submitText?: string;
  isSubmitting?: boolean;
}

export const CategoryForm = ({
  defaultValues,
  onSubmit,
  submitText = "Zapisz",
  isSubmitting = false,
}: CategoryFormProps) => {
  const form = useForm({
    resolver: zodResolver(productCategorySchema),
    defaultValues,
  });

  const isDirty = form.formState.isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nazwa kategorii" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end ">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Zapisywanie..." : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
