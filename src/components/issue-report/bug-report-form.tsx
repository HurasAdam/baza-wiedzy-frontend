import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// --- Spójne z backendem enumy ---
export const bugCategoriesByModule = {
  "Interfejs i UX": [
    { label: "Interfejs (wygląd i rozmieszczenie elementów)", icon: "🎨" },
    { label: "Trudności w obsłudze / nawigacji (UX)", icon: "🖱️" },
    { label: "Błędy tekstowe / literówki", icon: "✏️" },
  ],
  Stabilność: [{ label: "Błąd krytyczny (aplikacja się zawiesza lub wyrzuca błąd)", icon: "💥" }],
  Formularze: [
    { label: "Niepoprawne działanie formularzy (np. brak walidacji, pola nie zapisują się)", icon: "📝" },
    { label: "Nieprawidłowe powiadomienia lub alerty związane z formularzami", icon: "🔔" },
  ],
  "Panel administracyjny": [
    { label: "Zarządzanie rolami/uprawnieniami", icon: "🛡️" },
    { label: "Zarządzanie użytkownikami", icon: "👤" },
    { label: "Zarządzanie produktami", icon: "📦" },
    { label: "Zarządzanie tagami", icon: "🏷️" },
    { label: "Zarządzanie projektami JST", icon: "📁" },
    { label: "Zarządzanie tematami rozmów", icon: "💬" },
    { label: "Zarządzanie FAQ", icon: "❓" },
    { label: "Archiwum artykułów", icon: "📚" },
  ],
  "Pliki i inne": [
    { label: "Zarządzanie załącznikami (błędy przy dodawaniu lub pobieraniu plików)", icon: "📎" },
    { label: "Inne", icon: "⚙️" },
  ],
};

const formSchema = z.object({
  type: z.literal("bug"),
  title: z.string().trim().min(3, { message: "Tytuł błędu powinien zawierac conajmniej 3 znaki" }).max(90),
  category: z.object({
    slug: z.string().min(1),
    label: z.string().min(1),
  }),
  currentBehavior: z.string().trim().min(10, { message: "Opis obecnego zachowania musi mieć co najmniej 10 znaków." }),
  expectedBehavior: z
    .string()
    .trim()
    .min(10, { message: "Opis oczekiwanego zachowania musi mieć co najmniej 10 znaków." }),
  reproductionSteps: z
    .string()
    .trim()
    .min(10, { message: "Kroki do odtworzenia błędu muszą mieć co najmniej 10 znaków." }),
  file: z.array(z.instanceof(File)).optional(),
});

export type BugReportFormValues = z.infer<typeof formSchema>;

interface Props {
  onSend: (formData: BugReportFormValues) => void;
  isLoading?: boolean;
}

const BugReportForm = ({ onSend, isLoading }: Props) => {
  const form = useForm<BugReportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "bug",
      title: "",
      category: { slug: "", label: "" },
      currentBehavior: "",
      expectedBehavior: "",
      reproductionSteps: "",
      file: [],
    },
  });

  function onSubmit(values: BugReportFormValues) {
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
        {/* Tytuł */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel>Tytuł błędu</RequiredLabel>
              </FormLabel>
              <FormControl>
                <Input placeholder="Np. Aplikacja zawiesza się po wysłaniu danych formularza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kategoria */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategoria</FormLabel>
              <Select
                value={field.value ? JSON.stringify(field.value) : ""}
                onValueChange={(val) => field.onChange(JSON.parse(val))}
              >
                <FormControl>
                  <SelectTrigger className="min-w-[550px]">
                    <SelectValue placeholder="Wybierz kategorię błędu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[440px] overflow-y-auto">
                  {Object.entries(bugCategoriesByModule).map(([moduleSlug, categories], idx, arr) => (
                    <div key={moduleSlug}>
                      <SelectGroup>
                        <SelectLabel>{moduleSlug}</SelectLabel>
                        {categories.map((cat) => (
                          <SelectItem key={cat.label} value={JSON.stringify({ slug: moduleSlug, label: cat.label })}>
                            <span className="flex items-center gap-2 text-sm">
                              <span>{cat.icon}</span>
                              <span>{cat.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      {idx < arr.length - 1 && <SelectSeparator />}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Current Behavior */}
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
              <FormDescription className="text-xs">
                Np."Po kliknięciu przycisku zapisz w formularzu nic się nie dzieje"
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expected Behavior */}
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

        {/* Reproduction Steps */}
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
              <FormDescription className="text-xs">
                Krok po kroku - to ułatwi weryfikację i naprawe potencjalnego błędu
              </FormDescription>
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
