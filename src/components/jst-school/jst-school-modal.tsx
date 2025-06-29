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

import { useState } from "react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useCreateJstSchoolMutation } from "../../hooks/jst-schools/use-jst-schools";
import { jstSchoolSchema } from "../../validation/jst-school.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CreateWorkspaceProps {
  projects: [];
  isCreatingJstSchool: boolean;
  setIsCreatingJstSchool: (isCreatingWorkspace: boolean) => void;
}

export type JstSchoolForm = z.infer<typeof jstSchoolSchema>;

export const JstSchoolModal = ({
  projects,
  isCreatingJstSchool,
  setIsCreatingJstSchool,
}: CreateWorkspaceProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const form = useForm<JstSchoolForm>({
    resolver: zodResolver(jstSchoolSchema),
    defaultValues: {
      name: "",
      adres: "",
      email: "",
      szId: "",
      phone: "",
      jstProjectId: "",
    },
  });
  console.log("PROEJKTY", projects);
  const { mutate } = useCreateJstSchoolMutation();

  const onSubmit = (data: JstSchoolForm) => {
    const { jstProjectId, ...restData } = data;
    // mutate(data, {
    //   onSuccess: (data: any) => {
    //     form.reset();
    //     setIsCreatingWorkspace(false);
    //     toast.success("Workspace created successfully");
    //     navigate(`/workspaces/${data._id}`);
    //   },
    //   onError: (error: any) => {
    //     const errorMessage = error.response.data.message;
    //     toast.error(errorMessage);
    //     console.log(error);
    //   },
    // });

    mutate(
      { projectId: jstProjectId, data: restData },
      {
        onSuccess: () => {
          toast.success("Szkoła JST została dodana");
          form.reset();
          setIsCreatingJstSchool(false);
          queryClient.invalidateQueries({ queryKey: ["jst-schools"] });
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
                  color: "#991b1b", // ciemniejszy czerwony
                  fontSize: "14px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>
                    Błąd: Duplikat szId
                  </div>
                  <div style={{ opacity: 0.8 }}>
                    Podany szId już istnieje w bazie danych. Proszę wybrać inny.
                  </div>
                </div>
              </div>,
              { duration: 7000 }
            );
            return;
          }
          toast.error("Wystapił błąd, spróbuj ponownie");
        },
      }
    );
  };

  return (
    <Dialog
      open={isCreatingJstSchool}
      onOpenChange={setIsCreatingJstSchool}
      modal={true}
    >
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dodaj szkołę JST</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="jstProjectId"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Projekt</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-- Wybierz projekt --" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project._id} value={project._id}>
                              {project.name}
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa szkoły</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Wprowadź pełną nazwę szkoły"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="szId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID szkoły</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Wprowadź szId szkoły" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Wprowadź pełen adres szkoły (ulica...)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-input"
                        type="email"
                        {...field}
                        placeholder="Wprowadź oficjalny adres email szkoły"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --------------------------------------------------- */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon kontaktowy</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-input"
                        type="text"
                        {...field}
                        placeholder="Wprowadź oficjalny telefon kontaktowy"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button className="cursor-pointer" type="submit">
                Dodaj
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
