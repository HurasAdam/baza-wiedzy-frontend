import { FolderCheck, FolderKanban, Plus, Type } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { WorkspaceArticleFormData, WorkspaceFolder } from "../../validation/workspace-article.schema";
import { VariantCard } from "./VariantCard";

interface WorkspaceArticleFormProps {
  folders: WorkspaceFolder[];
}

const ARTICLE_MARKERS = [
  { value: "red", label: "Czerwony", color: "bg-red-500" },
  { value: "yellow", label: "Żółty", color: "bg-yellow-500" },
  { value: "green", label: "Zielony", color: "bg-green-500" },
  { value: "blue", label: "Niebieski", color: "bg-blue-500" },
];

export const WorkspaceArticleForm = ({ folders = [] }: WorkspaceArticleFormProps) => {
  const form = useFormContext<WorkspaceArticleFormData>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "responseVariants",
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <Card className="bg-card/80 p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          {/* ================= Folder ================= */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FolderKanban className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold">Folder docelowy</h3>
            </div>

            <FormField
              control={form.control}
              name="folderId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-muted/30 w-full">
                        <SelectValue placeholder="Wybierz folder" />
                      </SelectTrigger>

                      <SelectContent>
                        {folders.map((f) => (
                          <SelectItem key={f._id} value={f._id}>
                            <div className="flex items-center gap-2">
                              <FolderCheck className="w-4 h-4 text-primary" />
                              <span>{f.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ================= Marker ================= */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Type className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold">Marker</h3>
            </div>

            <FormField
              control={form.control}
              name="marker"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.value ?? "none"}
                      onValueChange={(val) => field.onChange(val === "none" ? undefined : val)}
                    >
                      <SelectTrigger className="bg-muted/30 w-full">
                        <SelectValue placeholder="Brak oznaczenia" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="none">Brak</SelectItem>

                        {ARTICLE_MARKERS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${m.color}`} />
                              {m.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </Card>

      {/* ===================================================== */}
      {/* Nazwa artykułu */}
      {/* ===================================================== */}
      <Card className="bg-card/80 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-1.5 pb-2 border-b border-border">
          <Type className="w-5 h-5 text-primary" />

          <h3 className="text-base font-semibold">Nazwa artykułu</h3>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Wprowadź nazwę artykułu" className="bg-muted/30 text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Card>

      {/* ===================================================== */}
      {/* Wersje odpowiedzi */}
      {/* ===================================================== */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <VariantCard
            key={field.id}
            index={index}
            onRemove={() => remove(index)}
            disableRemove={fields.length === 1}
          />
        ))}
      </div>

      {/* ===================================================== */}
      {/* Dodaj wersję */}
      {/* ===================================================== */}
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2 self-start"
        onClick={() => {
          const current = form.getValues("responseVariants") ?? [];
          const nextVersion = Math.max(...current.map((v) => v.version || 0), 0) + 1;

          append({
            version: nextVersion,
            variantName: `Wersja ${nextVersion}`,
            variantContent: "",
          });
        }}
      >
        <Plus className="w-4 h-4" />
        Dodaj wersję
      </Button>
    </div>
  );
};

///
