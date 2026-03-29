import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { Link as LinkIcon, Loader, Save, Star } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import queryClient from "../../config/query.client";
import {
  useFindOneUserPinnedLinkQuery,
  useUpdateOnePinnedLinkMutation,
} from "../../hooks/pinned-links/use-pinned-links";
import type { AuthUserData } from "../../types/user";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export const pinnedLinkSchema = z.object({
  name: z.string().min(1, "Nazwa linku jest wymagana"),
  url: z.string().min(3, "Podaj poprawny adres URL"),
  isFeatured: z.boolean().optional(),
});

export type UsefulLinkForm = z.infer<typeof pinnedLinkSchema>;

interface UsefulLinkModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editedLinkId: string;
}

export const EditPinnedLinkModal = ({ isOpen, setIsOpen, editedLinkId }: UsefulLinkModalProps) => {
  const { userData } = useOutletContext<{ onOpenCreateIssueReport: () => void; userData: AuthUserData }>();
  const { data: pinnedLink, isLoading, isRefetching } = useFindOneUserPinnedLinkQuery(editedLinkId, userData._id);
  const { mutate: updatePinnedLinkMutate, isPending: isCreateUsefulLinkLoading } = useUpdateOnePinnedLinkMutation();

  const form = useForm<UsefulLinkForm>({
    resolver: zodResolver(pinnedLinkSchema),
    defaultValues: {
      name: "",
      url: "",
      isFeatured: false,
    },
  });

  const onSubmit = (data: UsefulLinkForm) => {
    updatePinnedLinkMutate(
      { pinnedLinkId: pinnedLink._id, payload: data },
      {
        onSuccess: () => {
          toast.success("Dodano nowy link do zasobu", {
            position: "bottom-right",
          });
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: ["pinned-links", userData._id] });
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
                  <div style={{ opacity: 0.8 }}>Wybierz inną nazwę. Nazwa musi być unikalna.</div>
                </div>
              </div>,
              { duration: 7000, position: "bottom-right" },
            );
            return;
          }
          if (status === 422) {
            toast.warning(
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontFamily: "Inter, sans-serif",
                  color: "#b45309",
                  fontSize: "14px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Osiągnąłeś limit przypiętych linków</div>
                  <div style={{ opacity: 0.8 }}>Możesz przypiąć maksymalnie 32 linki.</div>
                </div>
              </div>,
              { duration: 7000, position: "bottom-right" },
            );
            return;
          }

          toast.error("Wystąpił nieoczekiwany błąd");
        },
      },
    );
  };

  useEffect(() => {
    if (pinnedLink) {
      form.reset({
        name: pinnedLink.name,
        url: pinnedLink.url,
        isFeatured: pinnedLink.isFeatured,
      });
    }
  }, [pinnedLink]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-2 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/40">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </div>

            <DialogTitle className="text-lg font-semibold leading-none">Edytuj przypięty link</DialogTitle>
          </div>

          <p className="text-sm text-muted-foreground max-w-[420px]">
            Zaktualizuj nazwę lub adres URL przypiętego linku.
          </p>
        </div>

        {isLoading || isRefetching ? (
          // LOADING SKELETON
          <div className="flex flex-col gap-5 pt-6 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded-md" />
              <div className="h-10 w-full bg-muted/70 rounded-md" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-28 bg-muted rounded-md" />
              <div className="h-10 w-full bg-muted/70 rounded-md" />
            </div>

            <div className="h-16 w-full bg-muted/60 rounded-md" />

            <div className="flex justify-end pt-4">
              <div className="h-10 w-32 bg-muted/70 rounded-md" />
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-6">
              {/* Nazwa */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa zasobu</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        placeholder="np. Monitorki"
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
                              Wyróżnione linki oznaczone są symbolem gwiazdy.
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
                  {isCreateUsefulLinkLoading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Zapisz link
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
