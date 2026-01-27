import { BoxIcon, Hash, Link, Loader, PersonStanding, Plus, Type } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { SelectOption } from "../../pages/create-article/CreateArticlePage";
import type { Article } from "../../types/article";
import { type ArticleFormData } from "../../validation/article.schema";
import MultipleSelector from "../shared/multiple-selector";
import { RequiredLabel } from "../shared/required-label";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { TooltipProvider } from "../ui/tooltip";
import ArticleResponseVariantCard from "./article-response-variant-card";

interface ArticleFormProps {
  article?: Article;
  tags: SelectOption[];
  products: SelectOption[];
  categories: SelectOption[];
  onProductChange: (productId: string) => void;
  loadingCategories: boolean;
}

const ArticleForm = ({ tags, products, categories, onProductChange, loadingCategories }: ArticleFormProps) => {
  const form = useFormContext<ArticleFormData>();
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "responseVariants" });

  return (
    <Form {...form}>
      <TooltipProvider>
        <form className="grid grid-cols-1 xl:grid-cols-20 gap-8 ">
          <div className="xl:col-span-12 flex flex-col gap-6 ">
            {/* ===================================================== */}
            {/* Tytuł */}
            {/* ===================================================== */}

            <Card className="px-4 py-6 shadow-xs border bg-card/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-header-foreground border-b pb-2.5">
                  <Type className="w-5 h-5 text-primary/90" />
                  <RequiredLabel>Tytuł artykułu</RequiredLabel>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Wprowadź tytuł artykułu..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* ===================================================== */}
            {/* Uwagi dla pracownika */}
            {/* ===================================================== */}
            <Card className="flex-[0_0_auto] px-4 py-6  min-h-[180px] shadow-xs border bg-card/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-header-foreground border-b pb-2.5">
                  <PersonStanding className="w-5 h-5 text-primary/90" />
                  <RequiredLabel>Uwagi dla pracownika</RequiredLabel>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-7">
                <FormField
                  control={form.control}
                  name="employeeDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Wprowadź uwagi dla pracownika..."
                          {...field}
                          className="min-h-[175px] border-input"
                        />
                      </FormControl>
                      <FormDescription className="text-[13px]">
                        Wewnętrzne uwagi widoczne tylko dla pracowników
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* ===================================================== */}
            {/* wersje odpowiedzi */}
            {/* ===================================================== */}
            {fields.map((item, index) => (
              <ArticleResponseVariantCard index={index} disableRemove={fields.length === 1} onRemove={remove} />
            ))}

            <Button
              className="flex items-center gap-2 self-start"
              type="button"
              variant="outline"
              disabled={fields.length === 4}
              onClick={() => {
                const current = form.getValues("responseVariants") ?? [];
                const nextVersion = Math.max(...current.map((v) => v.version || 0), 0) + 1;
                append({ version: nextVersion, variantName: `Wersja ${nextVersion}`, variantContent: "" });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />{" "}
              {fields.length <= 3 ? "Dodaj kolejną wersję" : "Osięgnięto limit wersji"}
            </Button>
          </div>

          <div className="xl:col-span-8 flex flex-col gap-6 h-full">
            {/* ===================================================== */}
            {/* Produkt*/}
            {/* ===================================================== */}
            <Card className="p-6 min-h-[190px] shadow-xs border bg-card/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-header-foreground border-b pb-2.5">
                  <BoxIcon className="w-5 h-5 text-primary/90" />
                  <RequiredLabel>Produkt</RequiredLabel>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            onProductChange(val);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Wybierz produkt" />
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
                      <FormDescription className="mt-3 text-[13px] text-muted-foreground">
                        Wybierz produkt, którego dotyczy artykuł, aby zapewnić jego prawidłową kategoryzację.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* ===================================================== */}
            {/* Kategoria*/}
            {/* ===================================================== */}
            <Card className="p-6 min-h-[200px]  shadow-xs border bg-card/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-header-foreground border-b pb-2.5">
                  <Link className="w-5 h-5 text-primary/90" />
                  <RequiredLabel>Kategoria</RequiredLabel>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange} disabled={loadingCategories}>
                          <SelectTrigger className="w-full">
                            {loadingCategories ? (
                              <Loader className="animate-spin w-4 h-4" />
                            ) : (
                              <SelectValue placeholder="Wybierz kategorię" />
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
                      <FormDescription className="mt-3 text-[13px]">
                        Wybierz kategorię pasującą do treści artykułu - lista zależy od wybranego produktu.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* ===================================================== */}
            {/* Tagi*/}
            {/* ===================================================== */}
            <Card className="p-6 min-h-[260px]  shadow-xs border bg-card/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-header-foreground border-b pb-2.5">
                  <Hash className="w-5 h-5 text-primary/90" />
                  <RequiredLabel>Tagi</RequiredLabel>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultipleSelector
                          placeholder="Wybierz tagi"
                          value={field.value}
                          defaultOptions={tags}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription className="mt-3 text-[13px]">
                        Wybierz co najmniej jeden tag – ułatwia to organizację artykułów.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </form>
      </TooltipProvider>
    </Form>
  );
};

export default ArticleForm;
