import { Text, Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { WorkspaceArticleFormData } from "../../validation/workspace-article.schema";

interface VariantCardProps {
  index: number;
  onRemove: () => void;
  disableRemove: boolean;
}

export const VariantCard = ({ index, onRemove, disableRemove }: VariantCardProps) => {
  const { control } = useFormContext<WorkspaceArticleFormData>();

  const variantName = useWatch({
    control,
    name: `responseVariants.${index}.variantName`,
  });

  return (
    <Card className="bg-card/80 p-6 shadow-xs">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-1.5 pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Text className="w-5 h-5 text-primary" />
          <span className="font-semibold">{variantName || `Wersja ${index + 1}`}</span>
        </div>

        <Button type="button" variant="ghost" size="icon" onClick={onRemove} disabled={disableRemove}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* ===== Fields ===== */}
      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name={`responseVariants.${index}.variantName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-muted-foreground">Nazwa wersji</FormLabel>
              <FormControl>
                <Input {...field} placeholder={`Wersja ${index + 1}`} className="bg-muted/30" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`responseVariants.${index}.variantContent`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-muted-foreground">Treść wersji</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} placeholder="Treść artykułu…" className="bg-muted/30 min-h-[160px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
};
