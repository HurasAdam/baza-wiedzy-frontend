import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { cn } from "../../lib/utils";
import type { Folder } from "../../pages/workspace-manage-folders/components/ManageFoldersFilters";
import type { EditWorkspaceArticleFormData } from "../../validation/edit-workspace-article.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface EditWorkspaceArticleFormProps {
  defaultValues: EditWorkspaceArticleFormData;
  folders: Folder[];
  onSubmit: (data: EditWorkspaceArticleFormData) => void;
  isSaving?: boolean;
  onClose?: () => void;
}

export const EditWorkspaceArticleForm = ({
  defaultValues,
  folders,
  onSubmit,
  isSaving = false,
  onClose,
}: EditWorkspaceArticleFormProps) => {
  const form = useForm<EditWorkspaceArticleFormData>({
    defaultValues,
    mode: "onChange",
  });

  console.log("F", folders);
  const isDirty = form.formState.isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "Nazwa wariantu jest wymagana" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł</FormLabel>
              <FormControl>
                <Input placeholder="Wpisz nazwę wariantu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="marker"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-foreground/80">Marker</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="w-full border">
                    <SelectValue placeholder="Wybierz kolor markera…" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent side="bottom">
                  {["red", "yellow", "green", "blue", "none"].map((color) => (
                    <SelectItem
                      key={color}
                      value={color}
                      className="
                flex items-center gap-3 py-2.5 px-3
                cursor-pointer
                transition-all duration-150
                data-[highlighted]:bg-primary/10
                data-[highlighted]:text-primary
                rounded-lg
                text-base
              "
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center border",
                          color === "red" && "bg-red-500/30 border-red-600/95",
                          color === "yellow" && "bg-yellow-400/30 border-yellow-500/95",
                          color === "green" && "bg-green-500/30 border-green-600/95",
                          color === "blue" && "bg-blue-500/30 border-blue-600/95",
                        )}
                      />
                      <span className="font-medium capitalize">{color}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="folderId"
          rules={{ required: "Wybierz folder" }}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-foreground/80">Folder</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full border-ring">
                    <SelectValue placeholder="Wybierz folder…" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent side="bottom">
                  {folders.map((folder) => (
                    <SelectItem
                      key={folder._id}
                      value={folder._id}
                      className="
          flex items-center gap-3 py-2.5 px-3 
          cursor-pointer
          transition-all duration-150r
          data-[highlighted]:bg-primary/10
          data-[highlighted]:text-primary
          rounded-lg
          text-base
        "
                    >
                      {/* Ikona folderu */}
                      <div className="w-5 h-5 rounded-md bg-primary/15 flex items-center justify-center text-primary">
                        📁
                      </div>
                      <span className="font-medium">{folder.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} type="button" disabled={isSaving}>
            Anuluj
          </Button>
          <Button disabled={isSaving || !isDirty} className="cursor-pointer flex items-center gap-2" type="submit">
            {isSaving ? <Loader className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
            Zapisz
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
