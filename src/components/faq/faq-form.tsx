import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, ArrowUp, Image, Palette, Plus, Text, Trash2, Type } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { COLOR_TOKEN_MAP, COLORS, ICONS } from "../../constants/faq-icons";
import type { FaqFormValues } from "../../validation/create-faq.schema";
import { RequiredLabel } from "../shared/required-label";

const cssVar = (name: string) => `var(${name})`;

const FaqForm = () => {
  const { control, register, watch, setValue } = useFormContext<FaqFormValues>();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "questions",
    keyName: "fieldId",
  });

  const watched = watch();
  const iconKeys = useMemo(() => Object.keys(ICONS), []);

  const moveUp = (i: number) => i > 0 && move(i, i - 1);
  const moveDown = (i: number) => i < fields.length - 1 && move(i, i + 1);

  const getColorVar = (key: string) => COLOR_TOKEN_MAP[key] || COLOR_TOKEN_MAP.gray;

  return (
    <form className="grid grid-cols-1 xl:grid-cols-20 gap-8 flex-1">
      {/* ===================================================== */}
      {/* ================= Nazwa i opis faq ================= */}
      {/* ===================================================== */}
      <div className="xl:col-span-12 flex flex-col gap-6">
        {/* Tytuł */}
        <Card className="px-4 py-5.5 bg-card/70 shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-header-foreground border-b pb-2.5">
              <Type className="w-5 h-5 text-primary/90" />
              <RequiredLabel>Nazwa i opis</RequiredLabel>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <Input {...register("title", { required: true })} placeholder="Tytuł FAQ" />
            <Textarea {...register("description")} placeholder="Opis" rows={3} />
          </CardContent>
        </Card>
        {/* ===================================================== */}
        {/* ================= Lista pytań ================= */}
        {/* ===================================================== */}
        <Card className="px-4 py-5.5 bg-card/70 shadow-xs">
          <CardHeader className="flex justify-between border-b">
            <CardTitle className="flex items-center gap-2 text-header-foreground ">
              <Text className="w-5 h-5 text-primary/90" />
              <RequiredLabel>Lista pytań</RequiredLabel>
            </CardTitle>
            <Button type="button" size="sm" onClick={() => append({ question: "", answer: "" })}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj pytanie
            </Button>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {fields.map((f, i) => (
              <Card key={f.fieldId} className="p-4 border bg-background">
                <Input
                  {...register(`questions.${i}.question`, {
                    required: "Pytanie jest wymagane",
                    minLength: { value: 3, message: "Pytanie musi mieć co najmniej 3 znaki" },
                    maxLength: { value: 200, message: "Pytanie może mieć maksymalnie 200 znaków" },
                  })}
                  placeholder={`Pytanie ${i + 1}`}
                />

                <Textarea
                  {...register(`questions.${i}.answer`, {
                    required: "Odpowiedź jest wymagana",
                    minLength: { value: 3, message: "Odpowiedź musi mieć co najmniej 3 znaki" },
                    maxLength: { value: 2000, message: "Odpowiedź może mieć maksymalnie 2000 znaków" },
                  })}
                  placeholder="Odpowiedź"
                  rows={4}
                  className="mt-3"
                />

                <div className="flex justify-between mt-3">
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => moveUp(i)} disabled={i === 0}>
                      <ArrowUp />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => moveDown(i)} disabled={i === fields.length - 1}>
                      <ArrowDown />
                    </Button>
                  </div>

                  <Button disabled={fields.length === 1} size="sm" variant="destructive" onClick={() => remove(i)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Usuń
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-8 flex flex-col gap-6">
        {/* ===================================================== */}
        {/* ================= Etykieta ================= */}
        {/* ===================================================== */}
        <Card className="p-6 bg-card/70 shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-header-foreground border-b pb-2.5">
              <Image className="w-5 h-5 text-primary/90" />
              <RequiredLabel>Etykieta</RequiredLabel>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex gap-2 flex-wrap">
            {iconKeys.map((k) => {
              const Icon = ICONS[k];
              const active = watched.iconKey === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setValue("iconKey", k, { shouldDirty: true })}
                  className="w-10 h-10 rounded-md border flex items-center justify-center"
                  style={{
                    backgroundColor: active ? cssVar("--color-primary") : undefined,
                  }}
                >
                  <Icon />
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* ===================================================== */}
        {/* ================= Kolor etykiety ================= */}
        {/* ===================================================== */}
        <Card className="p-6 bg-card/70 shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-header-foreground border-b pb-2.5">
              <Palette className="w-5 h-5 text-primary/90" />
              <RequiredLabel>Kolor etykiety</RequiredLabel>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex gap-3">
            {COLORS.map((c) => {
              const active = watched.labelColor === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue("labelColor", c, { shouldDirty: true })}
                  className="w-8 h-8 rounded-full border-2 transition"
                  style={{
                    backgroundColor: getColorVar(c),
                    boxShadow: active ? `0 0 0 3px ${cssVar("--color-ring")}` : undefined,
                    borderColor: active ? cssVar("--color-primary") : undefined,
                  }}
                />
              );
            })}
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default FaqForm;
