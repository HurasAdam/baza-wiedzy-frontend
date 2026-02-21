import { Box, BoxIcon, CheckIcon, ChevronsUpDownIcon, Hash, Link, PersonStanding, Plus, Type } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { cn } from "../../lib/utils";
import type { SelectOption } from "../../pages/create-article/CreateArticlePage";
import type { Article } from "../../types/article";
import { type ArticleFormData } from "../../validation/article.schema";
import MultipleSelector from "../shared/multiple-selector";
import { RequiredLabel } from "../shared/required-label";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import { TooltipProvider } from "../ui/tooltip";
import ArticleResponseVariantCard from "./article-response-variant-card";

interface ArticleFormProps {
  article?: Article;
  tags: SelectOption[];
  products: (SelectOption & { color: string })[];
  categories: SelectOption[];
  onProductChange: (productId: string) => void;
  loadingCategories: boolean;
}

const ArticleForm = ({ tags, products, categories, onProductChange, loadingCategories }: ArticleFormProps) => {
  const form = useFormContext<ArticleFormData>();
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "responseVariants" });

  const [open, setOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [productValue, setProductValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

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
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <Popover open={open} onOpenChange={setOpen}>
                          <FormControl>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="min-w-[200px]max-w-xs justify-between bg-transparent"
                                aria-label="product combobox"
                              >
                                {field.value.value ? (
                                  products.find((method) => method.label === field.value.label)?.label
                                ) : (
                                  <span className="text-muted-foreground">Wybierz produkt...</span>
                                )}
                                <ChevronsUpDownIcon className="opacity-50" />
                              </Button>
                            </PopoverTrigger>
                          </FormControl>
                          <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                            <Command>
                              <CommandInput placeholder="Wyszukaj produkt... " />
                              <CommandList className="scrollbar-custom ">
                                <CommandEmpty>Brak wyników spełniających kryteria wyszukiwania</CommandEmpty>
                                <CommandGroup>
                                  {products.map((method) => (
                                    <CommandItem
                                      key={method.value}
                                      value={method.label}
                                      onSelect={() => {
                                        setProductValue(method.value);
                                        field.onChange(method);
                                        onProductChange(method.value);
                                        setOpen(false);
                                      }}
                                      className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/60"
                                    >
                                      <div
                                        className="flex items-center justify-center w-7 h-7 rounded-xl border shadow-sm transition-all group-hover:shadow-md"
                                        style={{
                                          borderColor: `${method.color}35`,
                                          backgroundColor: `${method.color}35`,
                                        }}
                                      >
                                        <Box size={18} style={{ color: method.color }} />
                                      </div>

                                      <span className="font-medium">{method.label}</span>

                                      <CheckIcon
                                        className={cn(
                                          "ml-auto transition-opacity text-primary",
                                          productValue === method.value ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription className="mt-3 text-[13px] text-muted-foreground">
                          Wybierz produkt, którego dotyczy artykuł, aby zapewnić jego prawidłową kategoryzację.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
                      <Popover open={openCategories} onOpenChange={setOpenCategories}>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openCategories}
                              className="min-w-[200px]max-w-xs justify-between bg-transparent "
                              aria-label="category combobox"
                            >
                              {field.value.value ? (
                                categories.find((method) => method.label === field.value.label)?.label
                              ) : (
                                <span className="text-muted-foreground">Wybierz kategorie..</span>
                              )}
                              <ChevronsUpDownIcon className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent
                          className="w-(--radix-popper-anchor-width) p-0 "
                          side="bottom"
                          align="start"
                          avoidCollisions={false}
                        >
                          <Command>
                            <CommandInput placeholder="Wyszukaj kategorie.." />
                            <CommandList className="scrollbar-custom ">
                              <CommandEmpty>Brak kategorii spełniających kryteria wyszukiwania</CommandEmpty>
                              <CommandGroup>
                                {categories.map((option) => (
                                  <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => {
                                      field.onChange(option);
                                      setCategoryValue(option.value);
                                      setOpenCategories(false);
                                    }}
                                    className={cn(
                                      "group flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out",
                                      categoryValue === option.value ? "bg-card shadow-sm" : "hover:bg-accent/10",
                                    )}
                                  >
                                    <div className="flex items-center justify-center w-5 h-5 rounded-sm">
                                      <Link
                                        size={14}
                                        className="text-muted-foreground group-hover:text-foreground transition-colors"
                                      />
                                    </div>

                                    <span className="font-medium text-header-foreground truncate">{option.label}</span>

                                    <CheckIcon
                                      className={cn(
                                        "ml-auto w-4 h-4 transition-opacity duration-200",
                                        categoryValue === option.value ? "opacity-100 text-primary" : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription className="mt-3 text-[13px] text-muted-foreground">
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
                          optionIcon={Hash}
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
