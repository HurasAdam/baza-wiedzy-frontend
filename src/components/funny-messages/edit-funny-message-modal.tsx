import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, MessageSquare, MessagesSquare, Save } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import queryClient from "../../config/query.client";
import {
  useFindFunnyMessageQuery,
  useUpdateOneFunnyMessageMutation,
} from "../../hooks/funny-messages/use-funny-messages";
import { updateFunnyMessageSchema } from "../../validation/funny-message.schema";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

export type UpdateFunnyMessageFormData = z.infer<typeof updateFunnyMessageSchema>;

interface EditFunnyMessageModalProps {
  messageId: string | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  closeOnOutsideClick?: boolean;
}

export const EditFunnyMessageModal = ({
  messageId,
  isOpen,
  setIsOpen,
  closeOnOutsideClick,
}: EditFunnyMessageModalProps) => {
  const { data: message } = useFindFunnyMessageQuery(messageId!);
  const { mutate, isPending: isSaving } = useUpdateOneFunnyMessageMutation();
  const form = useForm<UpdateFunnyMessageFormData>({
    resolver: zodResolver(updateFunnyMessageSchema),
    defaultValues: message || { title: "", entries: [{ author: "KLIENT", content: "" }] },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  useEffect(() => {
    if (message) {
      form.reset({
        title: message.title,
        entries: message.entries.map((e) => ({ author: e.author, content: e.content })),
      });
    }
  }, [message, form]);

  const onClose = () => setIsOpen(false);

  const onSubmit = (data: UpdateFunnyMessageFormData) => {
    if (!messageId) return;
    mutate(
      { messageId, data },
      {
        onSuccess: () => {
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Wiadomość została zaktualizowana",
          });
          queryClient.invalidateQueries({ queryKey: ["funny-messages"] });
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="max-h-[85vh] w-[75vw] min-w-4xl sm:w-[90vw] overflow-y-auto scrollbar-custom scrollbar-thumb-rounded scrollbar-thumb-muted-foreground focus:outline-none rounded-2xl p-8  bg-gradient-to-br from-background via-background/90 to-background/60 backdrop-blur-md"
      >
        {/* Nagłówek */}
        <DialogHeader className="border-b border-muted/20 pb-4 mb-6">
          <div className="flex items-center gap-3">
            {message?.type === "dialog" ? (
              <MessagesSquare className="w-5 h-5 text-primary" />
            ) : (
              <MessageSquare className="w-5 h-5 text-primary" />
            )}

            <DialogTitle className="text-xl font-semibold tracking-tight text-foreground/90">
              {message?.type === "dialog" ? "Edytuj dialog" : "Edytuj wiadomość"}
            </DialogTitle>
          </div>

          <p className="text-sm text-muted-foreground mt-1 max-w-[75%]">
            {message?.type === "dialog"
              ? "Zaktualizuj przebieg rozmowy pomiędzy klientem a pracownikiem."
              : "Zaktualizuj tytuł oraz treść wiadomości."}
          </p>
        </DialogHeader>

        {message && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Tytuł */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Tytuł</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={1}
                        placeholder="Tytuł wiadomości"
                        className="resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Single  */}
              {message.type === "single" && (
                <FormField
                  control={form.control}
                  name="entries.0.content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Treść wiadomości</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={6}
                          placeholder="Treść wiadomości"
                          className=" h-[320px] resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Dialog */}
              {message.type === "dialog" && (
                <div className="space-y-5">
                  {fields.map((fieldItem, index) => (
                    <div
                      key={fieldItem.id}
                      className="bg-background border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col gap-4">
                        <FormField
                          control={form.control}
                          name={`entries.${index}.author`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Autor</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Wybierz autora" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="KLIENT">Klient</SelectItem>
                                    <SelectItem value="PRACOWNIK">Pracownik</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`entries.${index}.content`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Treść wypowiedzi</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={4}
                                  placeholder="Treść wypowiedzi"
                                  className="h-[180px] resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <DialogFooter className="pt-6 flex justify-end">
                <Button type="submit" disabled={isSaving} className="px-6 py-2 gap-2 flex items-center">
                  {isSaving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Zapisz
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Zapisz
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
