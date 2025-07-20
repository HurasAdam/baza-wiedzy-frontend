import {
  CloudUpload,
  Info,
  Link,
  Loader,
  MessageCircle,
  Paperclip,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { SelectOption } from "../../pages/create-article/CreateArticlePage";
import type { Article } from "../../types/article";
import { type ArticleFormData } from "../../validation/article.schema";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "../shared/fileUploader";
import MultipleSelector from "../shared/multiple-selector";
import { RequiredLabel } from "../shared/required-label";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const dropZoneConfig = {
  maxFiles: 5,
  maxSize: 1024 * 1024 * 4, // 4MB
  multiple: true,
};

interface ArticleFormProps {
  onCancel?: () => void;
  article?: Article;
  tags: SelectOption[];
  products: SelectOption[];
  categories: SelectOption[];
  onCreate?: (payload: { formData: ArticleFormData }) => void;
  onUpdate?: (payload: {
    articleId: string;
    formData: ArticleFormData;
  }) => void;
  className?: string;
  onProductChange: (productId: string) => void;
  loadingCategories: boolean;
  isLoading?: boolean;
}

const ArticleForm = ({
  article,
  tags,
  products,
  categories,

  isLoading,
  className,
  onProductChange,
  loadingCategories,
}: ArticleFormProps) => {
  const form = useFormContext<ArticleFormData>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "responseVariants",
  });

  const [files, setFiles] = useState<File[]>(article?.file ?? []);

  return (
    <Form {...form}>
      <TooltipProvider>
        <form
          onSubmit={form.handleSubmit(form.handleSubmit)}
          className={`flex flex-col gap-6 ${className}`}
        >
          {/* Nagłówek z tytułem i przyciskami */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-primary/90" />
                  Nazwa artykułu
                </CardTitle>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="max-w-xs  bg-background border border-borderrounded-lg p-4 shadow-lg"
                  >
                    <div className="space-y-2">
                      <h4 className="m-0 text-sm font-semibold">
                        Wymogi nazwy
                      </h4>
                      <ul className="list-disc pl-5 pt-1.5 space-y-1 text-xs text-muted-foreground leading-snug">
                        <li>Unikalna w całym systemie</li>
                        <li>Czytelna i opisowa</li>
                        <li>3–90 znaków długości</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {/* Tytuł */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Tytuł</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Wprowadź tytuł artykułu..."
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <div className="flex justify-end gap-2">
              {onCancel && (
                <Button type="button" onClick={onCancel} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Wróć
                </Button>
              )}
              <Button
                type="submit"
                variant="default"
                disabled={article ? !isDirty : false}
              >
                {isLoading && <Loader className="animate-spin w-4 h-4 mr-2" />}
                <Save className="w-4 h-4 mr-1" />
                {article ? "Zapisz" : "Utwórz"}
              </Button>
            </div> */}
            </CardContent>
          </Card>

          <Card className="p-6 space-y-6">
            <CardHeader className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary/90" />
              <CardTitle className="text-lg font-semibold">
                Uwagi i opis dla pracownika
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="employeeDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Uwagi</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="➔ Wprowadź uwagi i wskazówki..."
                        className="resize-none min-h-[100px] "
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Wewnętrzne uwagi widoczne tylko dla pracowników.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            {fields.map((item, index) => (
              <Card key={item.id} className="p-6 space-y-2.5 relative mb-4">
                <CardHeader className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary/90" />
                  <CardTitle className="text-lg font-semibold">Treść</CardTitle>
                </CardHeader>

                <Button
                  type="button"
                  variant="ghost"
                  className="absolute top-3 right-5 py-0 hover:bg-primary cursor-pointer"
                  onClick={() => remove(index)}
                  aria-label={`Usuń wariant odpowiedzi numer ${index + 1}`}
                  disabled={fields.length === 1}
                >
                  <Trash2 />
                </Button>

                <CardContent className="space-y-7">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name={`responseVariants.${index}.variantContent`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treść odpowiedzi</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`➔ Treść odpowiedzi wersji ${
                              index + 1
                            }`}
                            className="resize-none min-h-[200px] "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              disabled={fields.length >= 4} // ograniczenie do 4 wersji
              onClick={() => {
                const current = form.getValues("responseVariants") ?? [];
                const nextVersion =
                  Math.max(...current.map((v) => v.version || 0), 0) + 1;
                append({
                  version: nextVersion,
                  variantContent: "",
                  variantName: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />{" "}
              {fields.length >= 4
                ? "Osiągnięto maksymalny limit wersji"
                : "Dodaj wersję odpowiedzi"}
            </Button>
          </div>

          {/* Powiązania */}
          <Card className="p-6 space-y-6">
            <CardHeader className="flex items-center gap-2">
              <Link className="w-5 h-5 text-primary/90" />
              <CardTitle className="text-lg font-semibold">
                Powiązania
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Produkt */}
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Produkt</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          onProductChange?.(value);
                        }}
                      >
                        <SelectTrigger className="w-56 min-w-56">
                          <SelectValue placeholder="➔ Wybierz produkt" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kategoria */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Kategoria</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={loadingCategories}
                      >
                        <SelectTrigger className="w-56 min-w-56">
                          {loadingCategories ? (
                            <div className="flex items-center space-x-2">
                              <Loader className="animate-spin h-4 w-4" />
                              <span>Ładowanie kategorii...</span>
                            </div>
                          ) : (
                            <SelectValue placeholder="➔ Wybierz kategorię" />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tagi */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Tagi</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <MultipleSelector
                        placeholder="➔ Wybierz tag"
                        badgeClassName="bg-foreground text-background"
                        className="bg-background text-foreground"
                        value={field.value}
                        defaultOptions={tags}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Załączniki */}
          <Card className="p-6 space-y-6">
            <CardHeader className="flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-primary/90" />
              <CardTitle className="text-lg font-semibold">
                Załączniki
              </CardTitle>
              <CardDescription>
                Maksymalnie 5 plików do 4MB każdy
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <FileUploader
                        value={files}
                        onValueChange={setFiles}
                        dropzoneOptions={dropZoneConfig}
                      >
                        <FileInput>
                          <div className="flex items-center justify-center flex-col p-6 w-full">
                            <CloudUpload className="text-gray-500 w-10 h-10" />
                            <p className="mb-1 text-sm text-gray-500">
                              <span className="font-semibold">
                                Kliknij lub przeciągnij plik
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              SVG, PNG, JPG, GIF
                            </p>
                          </div>
                        </FileInput>
                        <FileUploaderContent>
                          {files?.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4" />
                              <span>{file.name}</span>
                            </FileUploaderItem>
                          ))}
                        </FileUploaderContent>
                      </FileUploader>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </TooltipProvider>
    </Form>
  );
};

export default ArticleForm;
