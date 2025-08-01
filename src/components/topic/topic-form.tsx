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
import type { topicFormData } from "./topic-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { topicSchema } from "@/validation/topic.schema";
import type { IProduct } from "@/types/product";

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
}

export const TopicForm = ({
  products,
  defaultValues,
  onSubmit,
  submitText = "Zapisz",
  isSubmitting = false,
}: TopicFormProps) => {
  const form = useForm<topicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues,
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="-- Wybierz produkt --" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      {products?.map((product) => (
                        <SelectItem key={product?._id} value={product?._id}>
                          {product?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

        <div className="flex justify-end ">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Zapisywanie..." : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
