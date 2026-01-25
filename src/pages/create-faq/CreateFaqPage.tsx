import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { AxiosError } from "axios";
import { ArrowDown, ArrowUp, Check, Loader, Plus, Trash2 } from "lucide-react";
import { useMemo, useRef } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { COLOR_TOKEN_MAP, COLORS, ICONS } from "../../constants/faq-icons";
import { useCreateFaqMutaton } from "../../hooks/faq/use-faq";

type QuestionItem = { question: string; answer: string };
type FaqFormValues = {
  title: string;
  description?: string;
  iconKey: string;
  labelColor: string;
  questions: QuestionItem[];
};

const cssVar = (name: string) => `var(${name})`;

export function CreateFaqPage() {
  const navigate = useNavigate();
  const methods = useForm<FaqFormValues>({
    defaultValues: {
      title: "",
      description: "",
      iconKey: "TableOfContents",
      labelColor: "blue",
      questions: [{ question: "", answer: "" }],
    },
    mode: "onChange",
  });

  const { control, handleSubmit, watch, reset, setValue } = methods;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "questions",
    keyName: "fieldId",
  });

  const watched = watch();
  const iconRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const iconKeys = useMemo(() => Object.keys(ICONS), []);

  const addQuestion = () => append({ question: "", answer: "" });
  const { mutate, isPending } = useCreateFaqMutaton();
  const onSubmit = (data: FaqFormValues) =>
    mutate(data, {
      onSuccess: () => {
        toast.success("FAQ zostało dodane");
        navigate(-1);
      },
      onError: (error: AxiosError) => {
        const { status } = error;
        if (status === 403) {
          toast.error("Brak wymaganych uprawnień do wykonania tej operacji.");
          return;
        }
        toast.error("Wystapił błąd, spróbuj ponownie");
      },
    });

  const moveUp = (i: number) => i > 0 && move(i, i - 1);
  const moveDown = (i: number) => i < fields.length - 1 && move(i, i + 1);

  const getColorVar = (key: string) => COLOR_TOKEN_MAP[key] || COLOR_TOKEN_MAP.gray;

  return (
    <div className="mx-auto ">
      <header className="flex items-start justify-between gap-6 mb-6">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold">Kreator FAQ</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Utwórz nową sekcję FAQ : określ tytuł, wygląd i zestaw pytań
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button disabled={isPending} variant="outline" onClick={() => navigate(-1)}>
            Anuluj
          </Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            {isPending ? <Loader className="animate-spin" /> : <Check className="mr-2 h-4 w-4" />} Zapisz
          </Button>
        </div>
      </header>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-6">
                {/* Tytuł */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">FAQ title</label>
                  <Input
                    className="mt-2 border-ring"
                    {...methods.register("title", { required: true })}
                    placeholder="Np. Rozpoczęcie roku"
                  />
                </div>

                {/*  Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <Textarea
                      {...methods.register("description")}
                      placeholder="Krótki opis"
                      className="mt-2 border-ring"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Ikona */}
                <div className="pt-2 pb-1 border-t border-border">
                  <div className="mb-3">
                    <label className="text-sm font-medium text-muted-foreground">Ikona</label>
                    <p className="text-xs text-muted-foreground mt-1">Wybierz ikonę reprezentującą FAQ</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {iconKeys.map((k) => {
                      const Icon = ICONS[k];
                      const active = watched.iconKey === k;
                      return (
                        <button
                          type="button"
                          key={k}
                          ref={(el) => (iconRefs.current[k] = el)}
                          type="button"
                          aria-pressed={active}
                          title={k}
                          onClick={() => setValue("iconKey", k, { shouldDirty: true })}
                          className="w-10 h-10 p-1 rounded-md border flex items-center justify-center cursor-pointer transition"
                          style={
                            active
                              ? {
                                  backgroundColor: cssVar("--color-primary"),
                                  color: cssVar("--color-primary-foreground"),
                                  boxShadow: `0 0 0 4px ${cssVar("--color-ring")}`,
                                  borderColor: "transparent",
                                }
                              : {
                                  backgroundColor: cssVar("--color-card"),
                                  color: cssVar("--color-card-foreground"),
                                  borderColor: cssVar("--color-border"),
                                }
                          }
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Color picker */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Kolor</label>
                        <p className="text-xs text-muted-foreground mt-1">Wybierz kolor etykiety reprezentującej FAQ</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {COLORS.map((c) => {
                        const active = watched.labelColor === c;
                        const bg = getColorVar(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setValue("labelColor", c, { shouldDirty: true })}
                            title={c}
                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center focus:outline-none transition-transform"
                            style={{
                              backgroundColor: bg,
                              borderColor: active ? "transparent" : cssVar("--color-border"),
                              boxShadow: active ? `0 0 0 4px ${cssVar("--color-ring")}` : undefined,
                              transform: active ? "scale(1.06)" : undefined,
                            }}
                          >
                            {active ? (
                              <Check
                                className="w-3 h-3"
                                style={{
                                  color: cssVar("--color-primary-foreground"),
                                }}
                              />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Separator className="mb-4" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-header-foreground">Lista pytań</h3>
                  <div>
                    <Button size="sm" type="button" onClick={() => addQuestion()}>
                      <Plus className="w-4 h-4 mr-2" /> Dodaj
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {fields.map((field, idx) => (
                    <Card key={field.fieldId} className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 min-w-0">
                          <label className="text-sm font-medium text-muted-foreground">Pytanie</label>
                          <Input
                            {...methods.register(`questions.${idx}.question` as const, { required: true })}
                            className="mt-2 border-ring"
                            placeholder={`Pytanie #${idx + 1}`}
                          />
                          <label className="text-sm font-medium text-muted-foreground mt-4">Odpowiedź</label>
                          <Textarea
                            {...methods.register(`questions.${idx}.answer` as const, { required: true })}
                            className="mt-2"
                            rows={4}
                            placeholder="Treść odpowiedzi..."
                          />
                        </div>

                        <div className="flex flex-col gap-3 items-end">
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveUp(idx)}
                              disabled={idx === 0}
                              title="Przenieś w górę"
                            >
                              <ArrowUp />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveDown(idx)}
                              disabled={idx === fields.length - 1}
                              title="Przenieś w dół"
                            >
                              <ArrowDown />
                            </Button>
                          </div>

                          <Button size="sm" variant="destructive" onClick={() => remove(idx)}>
                            <Trash2 className="w-4 h-4" /> Usuń
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => reset()}>
                Reset
              </Button>
              <Button onClick={handleSubmit(onSubmit)}>
                <Check className="mr-2 h-4 w-4" /> Zapisz
              </Button>
            </CardFooter>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}
