import { zodResolver } from "@hookform/resolvers/zod";
import { BadgePlus, Loader, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useCreateUsefulLinkCategoryMutation } from "../../hooks/useful-link-categories/use-useful-link-categories";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

export const colorOptions = [
  "#E53E3E", // Red
  "#3182CE", // Blue
  "#2F855A", // Green
  "#D69E2E", // Yellow
  "#6B46C1", // Purple
  "#DD6B20", // Orange
  "#38B2AC", // Teal
  "#4A5568", // Slate
];

export const linkFolderSchema = z.object({
  name: z.string().min(1, "Nazwa kategorii jest wymagana"),
});

export type LinkFolderForm = z.infer<typeof linkFolderSchema>;

interface LinkFolderModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const LinkCategoryModal = ({ isOpen, setIsOpen }: LinkFolderModalProps) => {
  const { mutate: createUsefulLinkCategoryMutate, isPending: isCreateUsefulLinkFolderLoading } =
    useCreateUsefulLinkCategoryMutation();

  const form = useForm<LinkFolderForm>({
    resolver: zodResolver(linkFolderSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: LinkFolderForm) => {
    createUsefulLinkCategoryMutate(data, {
      onSuccess: () => {
        toast.success("Zmiany zostały zapisane", {
          position: "bottom-right",
          description: "Dodano nowy katalog",
        });
        form.reset();
        setIsOpen(false);
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
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Kategoria o tej nazwie już istnieje</div>
                <div style={{ opacity: 0.8 }}>Wybierz inną nazwę. Nazwy kategorii muszą być unikalne.</div>
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
      <DialogContent>
        <div className="space-y-2 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BadgePlus className="h-5 w-5" />
            </div>

            <DialogTitle className="text-lg font-semibold">Dodaj kategorię</DialogTitle>
          </div>

          <p className="text-xs text-muted-foreground">Utwórz kategorię, aby łatwiej organizować przydatne linki.</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa kategorii</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="np. Procedury"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Anuluj
              </Button>

              <Button type="submit" disabled={isCreateUsefulLinkFolderLoading}>
                {isCreateUsefulLinkFolderLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" /> Utwórz
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Utwórz
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
