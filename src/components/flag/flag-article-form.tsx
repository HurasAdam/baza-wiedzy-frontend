import { Flag, Loader, Save } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";

export interface FlagForm {
  flagId?: string;
}

interface FlagArticleFormProps {
  articleUserFlag?: { selectedFlag: { _id: string; name: string; color: string } | null };
  flags: { _id: string; name: string; color: string }[];
  isFlagListLoading: boolean;
  isSaving: boolean;
  onSubmit: (data: FlagForm) => void;
  setIsOpen: (open: boolean) => void;
}

export default function FlagArticleForm({
  articleUserFlag,
  flags,
  isFlagListLoading,
  isSaving,
  onSubmit,
  setIsOpen,
}: FlagArticleFormProps) {
  const form = useForm<FlagForm>({
    defaultValues: { flagId: articleUserFlag?.selectedFlag?._id || "" },
  });

  useEffect(() => {
    form.reset({ flagId: articleUserFlag?.selectedFlag?._id || "" });
  }, [articleUserFlag, form]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-custom">
          {isFlagListLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-11 w-full my-0.5 rounded-xl bg-muted/30 animate-pulse" />
              ))
            : flags.map((flag) => (
                <label
                  key={flag._id}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 rounded-xl border cursor-pointer",
                    form.watch("flagId") === flag._id ? "border-primary bg-primary/25" : "border-border/45"
                  )}
                >
                  <input type="radio" value={flag._id} {...form.register("flagId")} className="hidden" />
                  <Flag className="w-5 h-5" style={{ color: flag.color }} />
                  <span>{flag.name}</span>
                </label>
              ))}
        </div>

        <DialogFooter className="px-6 py-4 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
            Anuluj
          </Button>
          <Button type="submit" disabled={isSaving || !form.watch("flagId")}>
            {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Zapisz
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
