import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flag, Loader, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFindMyFlags } from "../../hooks/flag/user-flag";
import type { Article } from "../../types/article";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";

const flagSchema = z.object({
  flagId: z.string().optional(),
});

type FlagForm = z.infer<typeof flagSchema>;

interface FlagArticleModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  article: Article;
  articleUserFlag?: { selectedFlag: { _id: string; name: string; color: string } | null };
  onSave: (data: { flagId?: string; articleId: string }) => void;
  isLoading: boolean;
}

export const FlagArticleModal = ({
  isOpen,
  setIsOpen,
  article,
  articleUserFlag,
  onSave,
  isLoading,
}: FlagArticleModalProps) => {
  const { data: flags = [], isLoading: isFlagListLoading } = useFindMyFlags(isOpen);

  const form = useForm<FlagForm>({
    resolver: zodResolver(flagSchema),
    defaultValues: { flagId: articleUserFlag?.selectedFlag?._id || "" },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ flagId: articleUserFlag?.selectedFlag?._id || "" });
    }
  }, [isOpen, article, form]);

  const onSubmit = (data: FlagForm) => {
    onSave({ ...data, articleId: article._id });
  };

  const renderSkeleton = () =>
    Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="h-11 w-full my-0.5 rounded-xl bg-muted/30 animate-pulse" />
    ));

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[55vh] text-center px-6">
      <Flag className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">Nie masz jeszcze żadnych flag</h3>
      <p className="text-sm text-muted-foreground">
        Flagi pozwalają oznaczać artykuły i organizować je w sposób bardziej przejrzysty.
      </p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="w-[460px] max-w-[95vw] min-h-[74vh] max-h-[74vh] p-0 bg-background/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border/30 overflow-hidden flex flex-col">
        {/* Główek */}
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-border/20 bg-gradient-to-r from-background/80 to-muted/40 flex items-center gap-2">
          <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Flag className="w-5 h-5 text-primary" />
            Oznacz artykuł
          </DialogTitle>
        </DialogHeader>

        {/* Treść — lista flag */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-custom">
              {isFlagListLoading ? (
                renderSkeleton()
              ) : flags.length > 0 ? (
                <FormField
                  control={form.control}
                  name="flagId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-2">
                        {flags.map((flag) => (
                          <label
                            key={flag._id}
                            className={cn(
                              "flex items-center gap-3 w-full px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200",
                              field.value === flag._id
                                ? "border-primary bg-primary/25 shadow-md" // zaznaczone: wyraźne, subtelny cień
                                : "border-border/45 bg-card/55 hover:border-primary/40 hover:bg-background/70"
                            )}
                          >
                            <input
                              type="radio"
                              value={flag._id}
                              {...field}
                              checked={field.value === flag._id}
                              className="hidden"
                              onChange={() => field.onChange(flag._id)}
                            />
                            <Flag className="w-5 h-5 shrink-0" style={{ color: flag.color }} />
                            <span className="text-sm font-medium text-foreground truncate">{flag.name}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage className="mt-2 text-xs text-destructive" />
                    </FormItem>
                  )}
                />
              ) : (
                renderEmptyState()
              )}
            </div>

            {/* Stopka */}
            <DialogFooter className="px-6 py-4 border-t border-border/20 bg-muted/10 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Anuluj
              </Button>
              <Button
                disabled={isLoading || !form.watch("flagId")}
                type="submit"
                className={cn(
                  "flex items-center gap-2 transition",
                  (!form.watch("flagId") || isLoading) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Zapisz
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
