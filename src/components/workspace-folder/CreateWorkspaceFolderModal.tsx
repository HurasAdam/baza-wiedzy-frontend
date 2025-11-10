import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

import {
  AppWindow,
  Coffee,
  GraduationCap,
  Layers,
  LeafyGreen,
  LibraryBig,
  PanelsTopLeft,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useCreateWorkspaceFolderMutation } from "../../hooks/workspace-folders/use-workspace-folder";
import { workspaceFolderSchema } from "../../validation/workspace-folder.schema";

interface CreateWorkspaceFolderModalProps {
  isCreatingWorkspaceFolder: boolean;
  setIsCreatingWorkspaceFolder: (isCreatingWorkspaceFolder: boolean) => void;
  workspaceId: string;
}

export const WORKSPACE_ICONS = {
  Layers,
  Smartphone,
  LibraryBig,
  GraduationCap,
  AppWindow,
  PanelsTopLeft,
  Coffee,
  LeafyGreen,
};

export type WorkspaceFolderForm = z.infer<typeof workspaceFolderSchema>;

export const CreateWorkspaceFolderModal = ({
  isCreatingWorkspaceFolder,
  setIsCreatingWorkspaceFolder,
  workspaceId,
}: CreateWorkspaceFolderModalProps) => {
  const { mutate } = useCreateWorkspaceFolderMutation();
  const form = useForm<WorkspaceFolderForm>({
    resolver: zodResolver(workspaceFolderSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: WorkspaceFolderForm) => {
    console.log("FORMULARZ", data);
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
      {
        workspaceId, // z props
        payload: data, // dane formularza
      },
      {
        onSuccess: () => {
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Dodano nowy folder",
          });
          queryClient.invalidateQueries({ queryKey: ["workspace-folders", workspaceId] });
        },
      }
    );
  };

  return (
    <Dialog open={isCreatingWorkspaceFolder} onOpenChange={setIsCreatingWorkspaceFolder} modal={true}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            📁 Utwórz nowy folder w kolekcji
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Foldery pomagają organizować artykuły i zasoby w ramach kolekcji.
          </p>
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
                      <Input {...field} placeholder="Nazwa folderu" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workspaceId"
                render={({ field }) => (
                  <FormControl>
                    <input type="hidden" {...field} value={workspaceId} />
                  </FormControl>
                )}
              />
            </div>

            <DialogFooter>
              <Button className="cursor-pointer" type="submit">
                Utwórz
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
