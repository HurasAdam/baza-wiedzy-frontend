import { Box, Hash, Link, Loader, MessageCircle, Plus, RectangleEllipsis, Trash2, Type } from "lucide-react";
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
import { TooltipProvider } from "../ui/tooltip";

interface ArticleFormProps {
  article?: Article;
  tags: SelectOption[];
  products: SelectOption[];
  categories: SelectOption[];
  onProductChange: (productId: string) => void;
  loadingCategories: boolean;
}

const ArticleForm = ({ article, tags, products, categories, onProductChange, loadingCategories }: ArticleFormProps) => {
  const form = useFormContext<ArticleFormData>();
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "responseVariants" });
  const [files] = useState<File[]>(article?.file ?? []);

  return (
    <Form {...form}>
      <TooltipProvider>
        <form className="grid grid-cols-1 xl:grid-cols-20 gap-8 ">
          {/* LEWA KOLUMNA: 8/12 */}
          <div className="xl:col-span-12 flex flex-col gap-6 max-h-[80vh] ">
            <Card className="p-6  shadow-sm border bg-card/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-header-foreground">
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

            <Card className="flex-[0_0_auto]  min-h-[180px] shadow-sm border bg-card/70">
              <CardHeader className="flex items-center gap-2 px-6.5">
                <RectangleEllipsis className="w-5 h-5 text-primary/90" />
                <CardTitle>Uwagi dla pracownika</CardTitle>
              </CardHeader>
              <CardContent className="px-7">
                <FormField
                  control={form.control}
                  name="employeeDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Wprowadź uwagi dla pracownika..." {...field} className="min-h-[175px]" />
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

            {/* Warianty odpowiedzi */}
            {fields.map((item, index) => (
              <Card key={item.id} className="p-6 space-y-4 relative  shadow-sm border bg-card/70">
                <CardHeader className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary/90" />
                  <CardTitle>Treść wersji {index + 1}</CardTitle>
                </CardHeader>

                <Button
                  type="button"
                  variant="ghost"
                  className="absolute top-3 right-3"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 />
                </Button>

                <CardContent className="space-y-4">
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
                          <Textarea placeholder="Treść odpowiedzi" {...field} className="min-h-[200px]" />
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
              onClick={() => {
                const current = form.getValues("responseVariants") ?? [];
                const nextVersion = Math.max(...current.map((v) => v.version || 0), 0) + 1;
                append({ version: nextVersion, variantName: "", variantContent: "" });
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Dodaj wersję odpowiedzi
            </Button>
          </div>

          {/* PRAWA KOLUMNA: 4/12 */}
          <div className="xl:col-span-8 flex flex-col gap-6 h-full">
            {/* Uwagi dla pracownika (NA GÓRZE) */}

            {/* NOW1 */}
            <Card className="p-6 min-h-[190px] shadow-sm border bg-card/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-header-foreground">
                  <Box className="w-5 h-5 text-primary/90" />
                  Produkt
                </CardTitle>
              </CardHeader>
              <CardContent>
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

            {/* NOW2 */}
            <Card className="p-6 min-h-[200px]  shadow-sm border bg-card/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-header-foreground">
                  <Link className="w-5 h-5 text-primary/90" />
                  Kategoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Kategoria</RequiredLabel>
                      </FormLabel>
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

            {/* TAGS */}
            <Card className="p-6 min-h-[260px]  shadow-sm border bg-card/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-header-foreground">
                  <Hash className="w-5 h-5 text-primary/90" />
                  Tagi
                </CardTitle>
              </CardHeader>
              <CardContent>
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
