import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { workspaceFolderSchema } from "../../validation/workspace-folder.schema";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export type WorkspaceFolderForm = z.infer<typeof workspaceFolderSchema>;

interface WorkspaceFolderFormProps {
  onSubmit: (data: WorkspaceFolderForm) => void;
  workspaceId: string;
  folder?: { name: string };
  isLoading: boolean;
}

const WorkspaceFolderForm = ({ onSubmit, workspaceId, folder, isLoading }: WorkspaceFolderFormProps) => {
  const form = useForm<WorkspaceFolderForm>({
    resolver: zodResolver(workspaceFolderSchema),
    defaultValues: {
      name: folder ? folder.name : "",
    },
    mode: "onChange",
  });

  const nameValue = form.watch("name");
  const isNameUnchanged = nameValue === (folder?.name ?? "");

  return (
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
          <Button
            disabled={isNameUnchanged || isLoading}
            className="cursor-pointer flex items-center gap-2"
            type="submit"
          >
            {isLoading ? <Loader className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
            {folder ? "Zapisz" : "Utwórz"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default WorkspaceFolderForm;
