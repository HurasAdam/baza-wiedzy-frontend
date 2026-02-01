import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

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

export const proposalCategoriesByModule = {
  "Interfejs i UX": [
    { slug: "poprawa-ui", label: "Poprawa interfejsu (UI)", icon: "🎨" },
    { slug: "ulepszenie-nawigacji", label: "Ułatwienie nawigacji / UX", icon: "🖱️" },
    { slug: "nowe-elementy-wizualne", label: "Nowe elementy wizualne", icon: "✨" },
  ],
  Funkcjonalność: [
    { slug: "nowa-funkcja", label: "Nowa funkcja / moduł", icon: "🛠️" },
    { slug: "rozszerzenie-funkcji", label: "Rozszerzenie istniejącej funkcji", icon: "➕" },
  ],
  Powiadomienia: [
    { slug: "nowe-powiadomienia", label: "Nowe powiadomienia / alerty", icon: "🔔" },
    { slug: "usprawnienie-komunikatow", label: "Usprawnienie komunikatów dla użytkownika", icon: "📣" },
  ],
  PanelAdmina: [
    { slug: "ulepszenia-panelu", label: "Ulepszenia panelu administracyjnego", icon: "🛡️" },
    { slug: "raporty-statystyki", label: "Nowe raporty / statystyki", icon: "📊" },
    { slug: "zarzadzanie-rolami", label: "Zarządzanie rolami / uprawnieniami", icon: "👥" },
  ],
  Inne: [{ slug: "ogolne-sugestie", label: "Ogólne sugestie", icon: "⚙️" }],
};

const formSchema = z.object({
  type: z.literal("proposal"),
  title: z.string().trim().min(3, { message: "Tytuł propozycji powinien zawierać conajmniej 3 znaki" }).max(120),
  category: z.object({
    slug: z.string().min(1),
    label: z.string().min(1),
  }),
  currentBehavior: z.string().trim().min(10, { message: "Opis propozycji powinien zawierać conajmniej 10 znaków" }),
  expectedBehavior: z
    .string()
    .trim()
    .min(10, { message: "Opis korzyści powinien zawierać conajmniej 10 znaków" })
    .optional(),
  file: z.array(z.instanceof(File)).optional(),
});

export type ProposalReportFormValues = z.infer<typeof formSchema>;

interface Props {
  onSend: (formData: ProposalReportFormValues) => void;
  isLoading?: boolean;
}

const ProposalReportForm = ({ onSend, isLoading }: Props) => {
  const form = useForm<ProposalReportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "proposal",
      title: "",
      category: { slug: "", label: "" },
      currentBehavior: "",
      expectedBehavior: "",
      file: [],
    },
  });

  function onSubmit(values: ProposalReportFormValues) {
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
                <RequiredLabel>Tytuł propozycji</RequiredLabel>
              </FormLabel>
              <FormControl>
                <Input placeholder="Np. Dodanie nowego filtra w wyszukiwarce artykułów" {...field} />
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
              <Select value={JSON.stringify(field.value)} onValueChange={(val) => field.onChange(JSON.parse(val))}>
                <FormControl>
                  <SelectTrigger className="min-w-[550px]">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[440px] overflow-y-auto">
                  {Object.entries(proposalCategoriesByModule).map(([moduleSlug, categories], idx, arr) => (
                    <div key={moduleSlug}>
                      <SelectGroup>
                        <SelectLabel>{moduleSlug}</SelectLabel>
                        {categories.map((cat) => (
                          <SelectItem key={cat.slug} value={JSON.stringify({ slug: moduleSlug, label: cat.slug })}>
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
                <RequiredLabel>Opis propozycji</RequiredLabel>
              </FormLabel>
              <FormControl>
                <Textarea className="min-h-[120px]" placeholder="Opisz propozycję" {...field} />
              </FormControl>
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
              <FormLabel>Przewidywana korzyść</FormLabel>
              <FormControl>
                <Textarea className="min-h-[80px]" placeholder="Co zyska użytkownik po wdrożeniu?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex justify-end">
          <Button disabled={isLoading} type="submit" className="px-8">
            {isLoading && <Loader className="animate-spin mr-2" />}
            Wyślij propozycję
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProposalReportForm;
