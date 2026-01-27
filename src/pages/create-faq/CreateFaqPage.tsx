import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { Loader, Save } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FaqForm from "../../components/faq/faq-form";
import { useCreateFaqMutaton } from "../../hooks/faq/use-faq";
import { faqSchema, type FaqFormValues } from "../../validation/create-faq.schema";
import { Banner } from "./components/Banner";
import { Header } from "./components/Header";

export type QuestionItem = { question: string; answer: string };

export function CreateFaqPage() {
  const navigate = useNavigate();

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      title: "",
      description: "",
      iconKey: "TableOfContents",
      labelColor: "blue",
      questions: [{ question: "", answer: "" }],
    },
    mode: "onChange",
  });

  const watchedQuestions = form.watch("questions");

  const areQuestionsValid = watchedQuestions.every((q) => q.question.trim().length >= 3 && q.answer.trim().length >= 3);

  const canSave = form.formState.isValid && areQuestionsValid;

  const { mutate, isPending } = useCreateFaqMutaton();

  const onSave = (data: FaqFormValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("FAQ zostało dodane");
        navigate(-1);
      },
      onError: (error: AxiosError) => {
        if (error.status === 403) {
          toast.error("Brak wymaganych uprawnień");
          return;
        }
        toast.error("Wystąpił błąd");
      },
    });
  };

  const handleSubmit = form.handleSubmit(onSave);

  return (
    <div className="pb-5 max-w-[1400px] mx-auto min-h-screen flex flex-col">
      <Header onBack={() => navigate(-1)} />

      <Banner canSave={canSave} isLoading={isPending} onSave={handleSubmit} onCancel={() => navigate(-1)} />

      <FormProvider {...form}>
        <FaqForm />
      </FormProvider>

      <div className="border-t mt-4 py-4 px-6 flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Anuluj
        </Button>
        <Button onClick={handleSubmit} disabled={isPending || !canSave}>
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader className="animate-spin w-4 h-4" />
              Zapisz
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Zapisz
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
