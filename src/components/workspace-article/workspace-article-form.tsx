import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FolderKanban, Plus, RectangleEllipsis, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import type { WorkspaceArticleFormData } from "../../validation/workspace-article.schema";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

export const WorkspaceArticleForm = ({ folders = [] }) => {
  const form = useFormContext<WorkspaceArticleFormData>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "responseVariants",
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Wybór folderu */}
      <div className="bg-muted/10 px-8 pt-8 pb-9 space-y-6 rounded-md">
        <FormField
          control={form.control}
          name="folderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder docelowy</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="flex items-center border-ring">
                    <SelectValue placeholder="Wybierz folder" className="flex items-center" />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((f) => (
                      <SelectItem key={f._id} value={f._id} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-primary" />
                          <span>{f.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Nazwa artykułu */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa artykułu</FormLabel>
              <FormControl>
                <Input className="border-ring" placeholder="Wprowadź nazwę artykułu" {...field} />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
      </div>
      {/* Wersje artykułu */}
      <div className="flex flex-col gap-6  ">
        {fields.map((item, index) => (
          <div key={item.id} className=" p-4 flex flex-col gap-4 bg-muted/10 px-8 pt-8 pb-9 space-y-6 rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-700">
                <RectangleEllipsis className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-500">Wersja {index + 1}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              <FormField
                control={form.control}
                name={`responseVariants.${index}.variantName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa wersji</FormLabel>
                    <FormControl>
                      <Input className="border-ring" placeholder="Nazwa wersji" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`responseVariants.${index}.variantContent`}
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Treść wersji</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Treść wersji" rows={4} {...field} className="min-h-[180px] border-ring" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dodaj nową wersję */}
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => {
          const current = form.getValues("responseVariants") ?? [];
          const nextVersion = Math.max(...current.map((v) => v.version || 0), 0) + 1;
          append({ version: nextVersion, variantName: "", variantContent: "" });
        }}
      >
        <Plus /> Dodaj wersję
      </Button>
    </div>
  );
};
