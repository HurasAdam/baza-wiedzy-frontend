import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CloudUpload,
  Loader,
  Paperclip,
  Pencil,
  Plus,
  Save,
} from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { cn } from "../../lib/utils";
import type { SelectOption } from "../../pages/create-article/CreateArticlePage";
import type { Article } from "../../types/article";
import {
  articleSchema,
  type ArticleFormData,
} from "../../validation/article.schema";
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

const dropZoneConfig = {
  maxFiles: 5,
  maxSize: 1024 * 1024 * 4,
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
  onCancel,
  article,
  tags,
  products,
  categories,
  onCreate,
  onUpdate,
  isLoading,
  className,
  onProductChange,
  loadingCategories,
}: ArticleFormProps) => {
  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article ? article?.title : "",
      product: article ? article?.product?._id : "",
      category: article ? article?.category?._id : "",
      tags: article
        ? article.tags.map((tag) => ({ label: tag.name, value: tag._id }))
        : [],
      clientDescription: article ? article?.clientDescription : "",
      employeeDescription: article ? article?.employeeDescription : "",
      file: [],
    },
  });

  const [files, setFiles] = useState<File[] | null>(null);

  const onSubmit: SubmitHandler<ArticleFormData> = (values) => {
    if (article) {
      if (onUpdate) {
        onUpdate({ articleId: article._id, formData: values });
      }
    } else {
      if (onCreate) {
        onCreate({ formData: values });
      }
    }
  };

  const { isDirty } = form.formState;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`flex ${className} gap-10 h-full `}
        >
          <div className=" space-y-7 h-full w-[60%] ">
            {article ? (
              <span className="text-foreground font-medium flex items-center gap-2 ">
                <Button
                  className="disabled:opacity-100 disabled:cursor-default"
                  disabled={true}
                  variant="outline"
                  size="icon"
                >
                  <Pencil />
                </Button>
                Edytuj artykuł{" "}
                <span className="text-muted-foreground text-sm ml-1">
                  {article.title}
                </span>
              </span>
            ) : (
              <span className="text-foreground font-medium flex items-center gap-2 ">
                <Button
                  className="disabled:opacity-100 disabled:cursor-default"
                  disabled={true}
                  variant="outline"
                  size="icon"
                >
                  <Plus />
                </Button>
                Dodaj artykuł{" "}
                <span className="text-muted-foreground text-sm ml-1"></span>
              </span>
            )}
            <div className="flex justify-end mt-2.5">
              {onCancel && (
                <Button
                  onClick={onCancel}
                  type="button"
                  className="cursor-pointer"
                  variant="outline"
                >
                  <ArrowLeft />
                  Wróć
                </Button>
              )}
              {article && (
                <Button
                  disabled={article && !isDirty}
                  type="submit"
                  variant="outline"
                  className="cursor-pointer"
                >
                  {isLoading && <Loader className="animate-spin " />}
                  <Save />
                  Zapisz
                </Button>
              )}
              {!article && (
                <Button
                  disabled={article && !isDirty}
                  type="submit"
                  variant="outline"
                  className="cursor-pointer"
                >
                  {isLoading && <Loader className="animate-spin " />}
                  <Save />
                  Utwórz
                </Button>
              )}
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel> Tytuł</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Wprowadź tytuł artykułu..."
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {" "}
                    Wprowadź unikalny tytuł artykułu.
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
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
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {" "}
                    Pole przeznaczone na wewnętrzne uwagi i komentarze dotyczące
                    artykułu{" "}
                    <span className="text-xs text-foreground/55">
                      (dla pracowników)
                    </span>
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Odpowiedź dla klienta</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    {/* <Editor
                    value={field.value} // provide current value
                    onChange={field.onChange} // use form onChange handler
                  /> */}
                    <Textarea
                      placeholder="➔ Wprowadź treść odpowiedzi dla klienta..."
                      className="resize-none min-h-[420px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm">
                    Wpisz treść odpowiedzi, która zostanie przekazana klientowi.
                    Upewnij się, że jest zrozumiała i zawiera wszystkie istotne
                    informacje.
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="flex justify-between ">
              <p className="text-xs text-muted-foreground italic">
                Pola oznaczone <span className="text-primary">*</span> są
                wymagane.
              </p>
            </div>
          </div>
          <div className=" space-y-7 border rounded-lg p-7 w-[38%]">
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
                        field.onChange(value); // aktualizuje stan formularza
                        onProductChange?.(value); // aktualizuje stan wyżej, dzięki czemu odświeżają się kategorie
                      }}
                    >
                      <SelectTrigger className="w-full">
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
                  <FormDescription className="text-sm">
                    Wybierz produkt, do którego zostanie przypisany artykuł.
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div
              className={cn(
                !form.watch("product") && "pointer-events-none opacity-50"
              )}
            >
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
                        <SelectTrigger className="w-full">
                          {loadingCategories ? (
                            <div className="flex items-center space-x-2">
                              <Loader className="animate-spin h-4 w-4 text-muted-foreground" />
                              <span>Ładowanie kategorii...</span>
                            </div>
                          ) : (
                            <SelectValue placeholder="➔ Wybierz kategorie" />
                          )}
                        </SelectTrigger>

                        {!loadingCategories && (
                          <SelectContent>
                            {categories.map(({ label, value }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        )}
                      </Select>
                    </FormControl>
                    <FormDescription className="text-sm">
                      Wybierz jedną z kategorii dla wybranego produktu
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Tag</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <MultipleSelector
                      placeholder={
                        field.value && field.value.length > 0
                          ? ""
                          : "➔ Wybierz tag"
                      }
                      badgeClassName="bg-foreground text-background"
                      className="bg-background text-foreground"
                      value={field.value}
                      defaultOptions={tags && tags}
                      onChange={(selected) =>
                        field.onChange(selected.map((item) => item))
                      }
                    />
                  </FormControl>
                  <FormDescription className="text-sm">
                    Wybierz jeden lub więcej tagów, które najlepiej opisują
                    temat artykułu.
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_2536348418"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Dodaj załącznik{" "}
                    <span className="text-foreground/65 text-xs">
                      (Opcjonalnie)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <FileUploader
                      value={files}
                      onValueChange={setFiles}
                      dropzoneOptions={dropZoneConfig}
                      className="relative bg-background rounded-lg p-2"
                    >
                      <FileInput
                        id="fileInput"
                        className="outline-dashed outline-1 outline-slate-500"
                      >
                        <div className="flex items-center justify-center flex-col p-6 w-full ">
                          <CloudUpload className="text-gray-500 w-10 h-10" />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Kliknij, aby przesłać plik
                            </span>
                            &nbsp; lub przeciągnij i upuść go tutaj
                          </p>
                          <p className="text-xs text-muted-foreground">
                            SVG, PNG, JPG or GIF
                          </p>
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        {files &&
                          files.length > 0 &&
                          files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current " />
                              <span>{file.name}</span>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </FormControl>

                  <FormDescription className="text-xs flex flex-col px-2">
                    <span>
                      Wybierz plik, który chcesz przesłać jako załącznik.
                      Obsługiwane formaty: SVG, PNG, JPG, GIF.
                    </span>
                    <span>
                      Maksymalny rozmiar pojedynczego pliku wynosi 4 MB, a
                      liczba przesyłanych plików nie może przekroczyć 5.
                    </span>
                  </FormDescription>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
};

export default ArticleForm;
