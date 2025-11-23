import { Info, Link, Loader, MessageCircle, Pencil, Plus, RectangleEllipsis, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { SelectOption } from "../../pages/create-article/CreateArticlePage";
import type { Article } from "../../types/article";
import { type ArticleFormData } from "../../validation/article.schema";
import MultipleSelector from "../shared/multiple-selector";
import { RequiredLabel } from "../shared/required-label";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ArticleFormProps {
  onCancel?: () => void;
  article?: Article;
  tags: SelectOption[];
  products: SelectOption[];
  categories: SelectOption[];
  onCreate?: (payload: { formData: ArticleFormData }) => void;
  onUpdate?: (payload: { articleId: string; formData: ArticleFormData }) => void;
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
        <form onSubmit={form.handleSubmit(form.handleSubmit)} className={`flex flex-col gap-6 ${className}`}>
          {/* Nagłówek z tytułem i przyciskami */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-header-foreground">
                  <Pencil className="w-5 h-5 text-primary/90" />
                  Tytuł artykułu
                </CardTitle>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="max-w-xs bg-muted text-muted-foreground border border-borderrounded-lg p-4 shadow-lg"
                  >
                    <div className="space-y-2">
                      <h4 className="m-0 text-sm font-semibold">Wymogi tytułu artykułu</h4>
                      <ul className="list-disc pl-5 pt-1.5 space-y-1 text-xs leading-snug">
                        <li>Powinien być unikalny w systemie</li>
                        <li>Jasny i zrozumiały, opisujący zawartość artykułu</li>
                        <li>Długość: od 3 do 140 znaków</li>
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
                    <FormLabel className="text-header-foreground">
                      <RequiredLabel>Tytuł</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-ring bg-input/30"
                        placeholder="Wprowadź tytuł artykułu..."
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="p-6 space-y-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-header-foreground">
                  <RectangleEllipsis className="w-5 h-5 text-primary/90" />
                  Uwagi i opis dla pracownika
                </CardTitle>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="max-w-xs bg-muted text-muted-foreground border border-borderrounded-lg p-4 shadow-lg"
                  >
                    <div className="space-y-2">
                      <h4 className="m-0 text-sm font-semibold">Opis i uwagi dla pracownika</h4>
                      <ul className="list-disc pl-5 pt-1.5 space-y-1 text-xs leading-snug">
                        <li>wskazówki dotyczące poprawności lub stylu odpowiedzi</li>

                        <li>Długość: od 3 do 140 znaków</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="employeeDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-header-foreground">
                      <RequiredLabel>Uwagi</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="➔ Wprowadź uwagi i wskazówki..."
                        className="resize-none min-h-[100px] border-ring bg-input/30 "
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Wewnętrzne uwagi widoczne tylko dla pracowników.</FormDescription>
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
                  <CardTitle className="text-lg font-semibold text-header-foreground">Treść</CardTitle>
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
                      <FormItem className="text-header-foreground">
                        <FormLabel>Nazwa wersji</FormLabel>
                        <FormControl>
                          <Input className="border-ring bg-input/30" placeholder="Wpisz nazwę wersji" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`responseVariants.${index}.variantContent`}
                    render={({ field }) => (
                      <FormItem className="text-header-foreground">
                        <FormLabel>Treść odpowiedzi</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`➔ Treść odpowiedzi wersji ${index + 1}`}
                            className="resize-none min-h-[200px] border-ring bg-input/30 "
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
                const nextVersion = Math.max(...current.map((v) => v.version || 0), 0) + 1;
                append({
                  version: nextVersion,
                  variantContent: "",
                  variantName: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />{" "}
              {fields.length >= 4 ? "Osiągnięto maksymalny limit wersji" : "Dodaj wersję odpowiedzi"}
            </Button>
          </div>

          {/* Powiązania */}
          <Card className="p-6 space-y-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-header-foreground">
                  <Link className="w-5 h-5 text-primary/90" />
                  Powiązania
                </CardTitle>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="max-w-xs bg-muted text-muted-foreground border border-borderrounded-lg p-4 space-y-2.5 shadow-lg"
                  >
                    <div className="space-y-2">
                      <h4 className="m-0 text-sm font-semibold">Produkt:</h4>
                      <ul className="list-disc pl-5 pt-1.5 space-y-1 text-xs leading-snug">
                        <li>
                          Wybierz produkt, do którego artykuł zostanie przypisany,wybór produktu determinuje dostępne
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="m-0 text-sm font-semibold">Kategoria:</h4>
                      <ul className="list-disc pl-5 pt-1.5 space-y-1 text-xs leading-snug">
                        <li>Wybierz kategorię odpowiadającą treści artykułu</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="m-0 text-sm font-semibold">Tagi:</h4>
                      <ul className="list-disc pl-5 pt-1.5 space-y-1 text-xs leading-snug">
                        <li>Wybierz cofnajmniej jeden tag, który najlepiej pasuje do treści artykuł</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Produkt */}
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-header-foreground">
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
                        <SelectTrigger className="w-56 min-w-56 border-ring bg-input/30 ">
                          <SelectValue placeholder="➔ Wybierz produkt" />
                        </SelectTrigger>
                        <SelectContent className="border-ring ">
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
                    <FormLabel className="text-header-foreground">
                      <RequiredLabel>Kategoria</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange} disabled={loadingCategories}>
                        <SelectTrigger className="w-56 min-w-56 border-ring bg-input/30">
                          {loadingCategories ? (
                            <div className="flex items-center space-x-2">
                              <Loader className="animate-spin h-4 w-4" />
                              <span>Ładowanie kategorii...</span>
                            </div>
                          ) : (
                            <SelectValue placeholder="➔ Wybierz kategorię" />
                          )}
                        </SelectTrigger>
                        <SelectContent className="">
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
                    <FormLabel className="text-header-foreground">
                      <RequiredLabel>Tagi</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <MultipleSelector
                        placeholder="➔ Wybierz tag"
                        badgeClassName="bg-foreground text-background "
                        className=" text-foreground border-ring bg-input/30 "
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
          {/* <Card className="p-6 space-y-6">
            <CardHeader className="flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-primary/90" />
              <CardTitle className="text-lg font-semibold">Załączniki</CardTitle>
              <CardDescription>Maksymalnie 5 plików do 4MB każdy</CardDescription>
            </CardHeader>

            <CardContent>
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <FileUploader value={files} onValueChange={setFiles} dropzoneOptions={dropZoneConfig}>
                        <FileInput>
                          <div className="flex items-center justify-center flex-col p-6 w-full">
                            <CloudUpload className="text-gray-500 w-10 h-10" />
                            <p className="mb-1 text-sm text-gray-500">
                              <span className="font-semibold">Kliknij lub przeciągnij plik</span>
                            </p>
                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG, GIF</p>
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
          </Card> */}
        </form>
      </TooltipProvider>
    </Form>
  );
};

export default ArticleForm;
