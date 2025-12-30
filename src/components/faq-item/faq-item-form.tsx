import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import type { Faq } from "../../types/faq";
import { faqItemSchema } from "../../validation/faq-item.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

interface TopicFormProps {
  faqs: Faq[];
  defaultValues: { faq: string; question: string; answer: string };
  onSubmit: (data: { faqId: string; question: string; answer: string }) => void;
  submitText?: string;
  isSubmitting?: boolean;
  faqId?: string;
}

export const FaqItemForm = ({
  faqs,
  defaultValues,
  onSubmit,
  submitText = "Zapisz",
  isSubmitting = false,
  faqId,
}: TopicFormProps) => {
  const form = useForm({
    resolver: zodResolver(faqItemSchema),
    defaultValues: {
      ...defaultValues,
      faqId: faqId ?? defaultValues.faq,
    },
  });
  console.log("FAQS LIST", faqs);
  const isDirty = form.formState.isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="faqId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FAQ</FormLabel>
                <FormControl>
                  {faqId ? (
                    <>
                      <input type="hidden" {...field} value={faqId} />
                      <p className="text-sm text-muted-foreground">
                        {faqs.find((p) => p._id === faqId)?.title ?? "Wybrany produkt"}
                      </p>
                    </>
                  ) : (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Wybierz FAQ --" />
                      </SelectTrigger>
                      <SelectContent side="bottom">
                        {faqs?.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.title}
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
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pytanie</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Wprowadź pytanie" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odpowiedź</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-[400px] max-h-[400px] scrollbar-custom"
                    {...field}
                    placeholder="Uzupełnij odpowiedź"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <Loader className="animate-spin" />
                {submitText}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Check /> {submitText}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
