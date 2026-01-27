import { Text, Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import type { ArticleFormData } from "../../validation/article.schema";
import { RequiredLabel } from "../shared/required-label";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface Props {
  index: number;
  onRemove: () => void;
  disableRemove: boolean;
}

const ArticleResponseVariantCard = ({ index, onRemove, disableRemove }: Props) => {
  const { control } = useFormContext<ArticleFormData>();
  const variantName = useWatch({
    control,
    name: `responseVariants.${index}.variantName`,
  });

  return (
    <Card className="px-4 py-6 space-y-1 relative  shadow-xs border bg-card/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-header-foreground border-b pb-2.5">
          <Text className="w-5 h-5 text-primary/90" />
          <RequiredLabel>{variantName || `Wersja ${index + 1}`}</RequiredLabel>
        </CardTitle>
      </CardHeader>

      <Button
        type="button"
        variant="ghost"
        className="absolute top-3 right-3"
        onClick={onRemove}
        disabled={disableRemove}
      >
        <Trash2 />
      </Button>

      <CardContent className="space-y-4">
        <FormField
          control={control}
          name={`responseVariants.${index}.variantName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa wersji</FormLabel>
              <FormControl>
                <Input placeholder="Wpisz nazwę wersji" {...field} />
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
              <FormLabel>Treść odpowiedzi</FormLabel>
              <FormControl>
                <Textarea placeholder="Treść odpowiedzi" {...field} className="min-h-[200px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ArticleResponseVariantCard;
