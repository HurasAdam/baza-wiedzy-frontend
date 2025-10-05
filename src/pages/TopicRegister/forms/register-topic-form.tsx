import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Loader, Mail, Minus, Phone, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Form } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { useCreateReportTopicMutation } from "../../../hooks/report-topic/use-report-topic";
import type { ITopic } from "../../../types/topic";

const reportTopicSchema = z.object({
  topic: z.string().min(1, "Id zgłaszanego tematu jest wymagane"),
  description: z.string().optional(),
  count: z.number().min(1, "Ilość musi być >= 1").default(1),
});

interface RegisterTopicFormValues {
  topic: string;
  description?: string;
  count: number;
}

export const RegisterTopicForm = ({ topic }: { topic: ITopic }) => {
  const [feedback, setFeedback] = useState<null | "call" | "message">(null);
  const [loadingType, setLoadingType] = useState<null | "call" | "message">(null);

  const form = useForm<RegisterTopicFormValues>({
    resolver: zodResolver(reportTopicSchema),
    defaultValues: {
      topic: topic?._id || "",
      description: "",
      count: 1,
    },
  });

  const { mutate } = useCreateReportTopicMutation();
  const toastDuration = 2000;

  const onSubmit = (data: RegisterTopicFormValues, type: "call" | "message") => {
    if (!data.count || data.count < 1) data.count = 1;
    console.log("DATA", data);
    setLoadingType(type);

    mutate(
      { ...data, type },
      {
        onSuccess: () => {
          setFeedback(type);
          setLoadingType(null);
          form.reset({ topic: topic?._id || "", description: "", count: 1 });

          toast.success(
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                fontFamily: "Inter, sans-serif",
                color: "#111827",
                fontSize: "14px",
                lineHeight: "1.4",
                maxWidth: "360px",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, marginBottom: "2px", fontSize: "14px" }}>Zgłoszenie zapisane</div>
                <div style={{ opacity: 0.8, fontSize: "13px" }}>
                  Twoje zgłoszenie dla tematu <span style={{ fontWeight: 500, color: "#111827" }}>“{topic.title}”</span>{" "}
                  zostało pomyślnie dodane.
                </div>
              </div>
            </div>,
            { duration: toastDuration, position: "bottom-right" }
          );

          setTimeout(() => setFeedback(null), toastDuration);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form className="flex items-center gap-4 shrink-0">
        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Notatka (opcjonalnie)"
              className="h-10 w-[200px] text-sm px-3 py-1 bg-surface/70 focus:bg-surface/90 rounded-md"
            />
          )}
        />
        <Controller
          control={form.control}
          name="count"
          render={({ field }) => (
            <div className="flex items-center border rounded-lg bg-surface/70 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-l-lg"
                onClick={() => field.onChange(Math.max(1, Number(field.value) - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>

              <Input
                type="number"
                min={1}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                className="w-16 text-center bg-transparent focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-number-spin-button]:appearance-none"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-r-lg"
                onClick={() => field.onChange(Number(field.value) + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        />

        <div className="flex space-x-2">
          <Button
            type="button"
            size="icon"
            variant={feedback === "message" ? "ghost" : "default"}
            onClick={form.handleSubmit((data) => onSubmit(data, "message"))}
            disabled={loadingType === "message"}
            className="w-14 h-10 rounded-md transition-all hover:scale-105"
          >
            {loadingType === "message" ? (
              <Loader className="animate-spin w-5 h-5" />
            ) : feedback === "message" ? (
              <CircleCheck className="w-5 h-5 text-green-600/85" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
          </Button>

          <Button
            type="button"
            size="icon"
            variant={feedback === "call" ? "ghost" : "default"}
            onClick={form.handleSubmit((data) => onSubmit(data, "call"))}
            disabled={loadingType === "call"}
            className="w-14 h-10 rounded-md transition-all hover:scale-105"
          >
            {loadingType === "call" ? (
              <Loader className="animate-spin w-5 h-5" />
            ) : feedback === "call" ? (
              <CircleCheck className="w-5 h-5 text-green-600/85" />
            ) : (
              <Phone className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
