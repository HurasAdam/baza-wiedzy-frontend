import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import type { AxiosError } from "axios";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useCreateFunnyMessageMutation } from "../../hooks/funny-messages/use-funny-messages";
import { funnyMessageSchema } from "../../validation/funny-message.schema";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

export type FunnyMessageForm = z.infer<typeof funnyMessageSchema>;

interface Props {
  isCreatingFunnyMessage: boolean;
  setIsCreatingFunnyMessage: (open: boolean) => void;
  closeOnOutsideClick?: boolean;
}

export const FunnyMessageModal = ({
  isCreatingFunnyMessage,
  setIsCreatingFunnyMessage,
  closeOnOutsideClick,
}: Props) => {
  const form = useForm<FunnyMessageForm>({
    resolver: zodResolver(funnyMessageSchema),
    defaultValues: {
      title: "",
      type: "single",
      entries: [{ author: "KLIENT", content: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  const watchType = form.watch("type");

  // Reset entries when switching type
  useEffect(() => {
    if (watchType === "single") {
      replace([{ author: "KLIENT", content: "" }]);
    }
  }, [watchType, replace]);

  const { mutate } = useCreateFunnyMessageMutation();

  const onSubmit = (data: FunnyMessageForm) => {
    mutate(data, {
      onSuccess: (data) => {
        form.reset();
        setIsCreatingFunnyMessage(false);
        toast.success("Wiadomość została dodana");
        queryClient.invalidateQueries({ queryKey: ["funny-messages"] });
        return;
      },
      onError: (error: AxiosError) => {
        const { status } = error;
        if (status === 403) {
          toast.error("Brak wymaganych uprawnień do wykonania tej operacji.");
          return;
        }
        toast.error("Wystapił błąd, spróbuj ponownie");
      },
    });
  };

  return (
    <Dialog open={isCreatingFunnyMessage} onOpenChange={setIsCreatingFunnyMessage} modal={true}>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="max-h-[80vh] min-h-[48vh] bg-background  overflow-y-auto min-w-[34vw] scrollbar-custom"
      >
        <DialogHeader>
          <DialogTitle>Dodaj zabawną wiadomość</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-5 py-4">
              {/* Tytuł */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tytuł</FormLabel>
                    <FormControl>
                      <Input className="border-ring bg-input/30" {...field} placeholder="Tytuł wiadomości" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*------- message type ----- */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ wiadomości</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-ring ">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Pojedyncza wiadomość</SelectItem>
                        <SelectItem value="dialog">Dialog klient–pracownik</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*-------- signle message content ------ */}
              {watchType === "single" && (
                <FormField
                  control={form.control}
                  name={`entries.0.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treść wiadomości</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-26 border-ring "
                          {...field}
                          placeholder="Wpisz treść wiadomości"
                          rows={8}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/*-------- dialogue content ------ */}
              {watchType === "dialog" && (
                <div className="space-y-4">
                  {fields.map((fieldItem, index) => (
                    <div key={fieldItem.id} className="border rounded-md p-3 relative space-y-2">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.author`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Autor</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="KLIENT">Klient</SelectItem>
                                <SelectItem value="PRACOWNIK">Pracownik</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`entries.${index}.content`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Treść wypowiedzi</FormLabel>
                            <FormControl>
                              <Textarea className="border-ring" {...field} placeholder="Treść wypowiedzi" rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => remove(index)}
                      >
                        Usuń
                      </Button>
                    </div>
                  ))}

                  <Button type="button" variant="secondary" onClick={() => append({ author: "KLIENT", content: "" })}>
                    + Dodaj wypowiedź
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="submit">Zapisz</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
