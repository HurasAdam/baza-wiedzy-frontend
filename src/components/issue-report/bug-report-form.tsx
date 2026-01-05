import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const validCategories = [
  "Interfejs (UI)",
  "Doświadczenie użytkownika (UX)",
  "Wydajność",
  "Responsywność",
  "Błędy krytyczne (Crash)",
  "Dane / Walidacja formularzy",
  "Powiadomienia",
  "Autoryzacja / Logowanie",
  "Zarządzanie plikami",
  "Inne",
] as const;

interface Props {
  onSend: (formData: any) => void;
  isLoading?: boolean;
}

const formSchema = z.object({
  type: z.literal("bug"),
  title: z.string().trim().min(3).max(90),
  category: z.string().min(1),

  currentBehavior: z.string().trim().min(10, { message: "Opisz dokładniej co działa nie tak" }),

  expectedBehavior: z.string().trim().min(10, { message: "Opisz jak powinno to działać" }),

  reproductionSteps: z.string().trim().min(10, { message: "Podaj kroki umożliwiające odtworzenie błędu" }),

  file: z.array(z.instanceof(File)).optional(),
});

export type BugReportFormValues = z.infer<typeof formSchema>;

const BugReportForm = ({ onSend, isLoading }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "bug",
      title: "",
      category: "",
      currentBehavior: "",
      expectedBehavior: "",
      reproductionSteps: "",
      file: [],
    },
  });

  const [files, setFiles] = useState<File[] | null>(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSend(values);
  }

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span>
      {children}
      <span className="text-primary ml-0.5">*</span>
    </span>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-auto px-6.5 pt-3 rounded-xl bg-background">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel>Tytuł błędu</RequiredLabel>
              </FormLabel>
              <FormControl>
                <Input placeholder="Np. Aplikacja zawiesza się po zapisaniu formularza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategoria</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kategorię błędu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {validCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentBehavior"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel>Co działa nie tak?</RequiredLabel>
              </FormLabel>
              <FormControl>
                <Textarea className="min-h-[110px]" placeholder="Opisz co dokładnie się dzieje" {...field} />
              </FormControl>
              <FormDescription>Np. „Po kliknięciu Zapisz formularz się nie zapisuje”</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expectedBehavior"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel>Jak powinno to działać?</RequiredLabel>
              </FormLabel>
              <FormControl>
                <Textarea className="min-h-[110px]" placeholder="Opisz oczekiwane działanie" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reproductionSteps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel>Jak odtworzyć problem?</RequiredLabel>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[130px]"
                  placeholder="1. Wejdź na stronę...\n2. Kliknij...\n3. Zobacz błąd"
                  {...field}
                />
              </FormControl>
              <FormDescription>Krok po kroku – to bardzo pomaga w szybkiej naprawie</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button disabled={isLoading} type="submit" className="px-8">
            {isLoading && <Loader className="animate-spin mr-2" />}
            Wyślij zgłoszenie
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BugReportForm;
