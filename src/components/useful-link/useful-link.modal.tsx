import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { Link as LinkIcon, Loader, Save, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import queryClient from "../../config/query.client";
import { useFindusefulLinksCategoriesQuery } from "../../hooks/useful-link-categories/use-useful-link-categories";
import { useCreateUsefulLinkMutation } from "../../hooks/useful-links/use-useful-links";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";

export const usefulLinkSchema = z.object({
  name: z.string().min(1, "Nazwa linku jest wymagana"),
  url: z.string().min(3, "Podaj poprawny adres URL"),
  description: z.string().optional(),
  linkCategory: z.string().min(1, "Wybierz kategorię"),
  isFeatured: z.boolean().optional(),
});

export type UsefulLinkForm = z.infer<typeof usefulLinkSchema>;

interface UsefulLinkModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const UsefulLinkModal = ({ isOpen, setIsOpen }: UsefulLinkModalProps) => {
  const { data: usefulLinkCategories } = useFindusefulLinksCategoriesQuery();
  const { mutate: createUsefulLinkMutate, isPending: isCreateUsefulLinkLoading } = useCreateUsefulLinkMutation();

  const form = useForm<UsefulLinkForm>({
    resolver: zodResolver(usefulLinkSchema),
    defaultValues: {
      name: "",
      url: "",
      description: "",
      linkCategory: "",
      isFeatured: false,
    },
  });

  const onSubmit = (data: UsefulLinkForm) => {
    createUsefulLinkMutate(data, {
      onSuccess: () => {
        toast.success("Dodano nowy link do zasobu", {
          position: "bottom-right",
        });
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: ["useful-links"] });
      },
      onError: (error) => {
        const { status } = error as AxiosError;

        if (status === 409) {
          toast.error(
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontFamily: "Inter, sans-serif",
                color: "#991b1b",
                fontSize: "14px",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Link do zasobu o tej nazwie już istnieje</div>
                <div style={{ opacity: 0.8 }}>Wybierz inną nazwę. Nazwa linku musi być unikalna.</div>
              </div>
            </div>,
            { duration: 7000, position: "bottom-right" },
          );
          return;
        }

        toast.error("Wystąpił nieoczekiwany błąd");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-2 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/40">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </div>

            <DialogTitle className="text-lg font-semibold leading-none">Dodaj link</DialogTitle>
          </div>

          <p className="text-sm text-muted-foreground max-w-[420px]">
            Zapisz przydatny link i przypisz go do kategorii, aby łatwo do niego wrócić.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-6">
            {/* Nazwa */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa linku</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="np. Dokumentacja API"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres URL</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Opis */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis (opcjonalnie)</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={3}
                      placeholder="Krótki opis linku do zasobu"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none placeholder:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoria</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                      <SelectContent>
                        {usefulLinkCategories?.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            <div className="flex items-center gap-2">
                              📁
                              <span>{category.name}</span>
                            </div>
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
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-2">
                  <FormControl>
                    <div className="border relative flex w-full items-start gap-2 rounded-md  p-4 shadow-xs outline-none">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2.5 data-[state=checked]:[&_span]:rtl:-translate-x-2.5"
                      />
                      <div className="flex grow items-center gap-3">
                        <Star className={`${field.value ? "text-primary/85" : "text-muted-foreground"}`} />
                        <div className="grid grow gap-2">
                          <Label htmlFor={field.name}>Wyróżnij link</Label>
                          <p id={`${field.name}-description`} className="text-muted-foreground text-xs">
                            Wyróżnione linki wyświetlane jako pierwsze na liście.
                          </p>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Anuluj
              </Button>

              <Button type="submit" disabled={isCreateUsefulLinkLoading} className="flex items-center gap-2">
                {isCreateUsefulLinkLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Zapisz link
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
