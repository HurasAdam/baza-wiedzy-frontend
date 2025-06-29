import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useCreateJstProjectMutation } from "../../hooks/jst-projects/use-jst-projects";
import { jstProjectSchema } from "../../validation/jst-project.schema";

interface CreateWorkspaceProps {
  closeOnOutsideClick?: boolean;
  isCreatingJstProject: boolean;
  setIsCreatingJstProject: (isCreatingWorkspace: boolean) => void;
}

export type JstProjectForm = z.infer<typeof jstProjectSchema>;

export const JstProjectModal = ({
  closeOnOutsideClick = false,
  isCreatingJstProject,
  setIsCreatingJstProject,
}: CreateWorkspaceProps) => {
  const form = useForm<JstProjectForm>({
    resolver: zodResolver(jstProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate, isPending } = useCreateJstProjectMutation();

  const onSubmit = (data: JstProjectForm) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        setIsCreatingJstProject(false);
        toast.success("Projekt został dodany");
        queryClient.invalidateQueries({ queryKey: ["jst-projects"] });
      },
      onError: (error) => {
        const { status } = error;
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
                <div style={{ fontWeight: 600, marginBottom: 2 }}>
                  Błąd: Duplikat nazwy projektu
                </div>
                <div style={{ opacity: 0.8 }}>
                  Projekt o podanej nazwie już istnieje. Wybierz inną nazwę.
                </div>
              </div>
            </div>,
            { duration: 7000 }
          );
          return;
        }

        toast.error("Wystapił błąd, spróbuj ponownie");
      },
    });
  };

  return (
    <Dialog
      open={isCreatingJstProject}
      onOpenChange={setIsCreatingJstProject}
      modal={true}
    >
      <DialogContent
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
        className="max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Utwórz projekt JST</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nazwa projektu" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opis</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Opis projektu"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="animate-spin" />
                    Zapisuje
                  </span>
                ) : (
                  "Utwóz"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
