import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Loader2, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Form } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { useCreateReportTopicMutation } from "../../../hooks/report-topic/use-report-topic";
import type { ITopic } from "../../../types/topic";
import { reportTopicSchema } from "../../../validation/report-topic.schema";

export const RegisterTopicForm = ({ topic }: { topic: ITopic }) => {
  const [feedback, setFeedback] = useState<null | "call" | "message">(null);
  const [loadingType, setLoadingType] = useState<null | "call" | "message">(null);
  const form = useForm({
    resolver: zodResolver(reportTopicSchema),
    defaultValues: {
      description: "",
      topic: topic?._id || "",
    },
  });
  console.log(topic);
  const { mutate } = useCreateReportTopicMutation();
  const toastDuration = 2000; // ms

  const onSubmit = (data: { description: string }, type: "call" | "message") => {
    setLoadingType(type);

    const finalData = { ...data, type };
    mutate(finalData, {
      onSuccess: () => {
        setFeedback(type);
        setLoadingType(null);
        form.reset();

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
                Twoje zgłoszenie dla tematu <span style={{ fontWeight: 500, color: "#111827" }}>“{topic?.title}”</span>{" "}
                zostało pomyślnie dodane.
              </div>
            </div>
          </div>,
          { duration: toastDuration }
        );

        // reset feedback po czasie toastu
        setTimeout(() => setFeedback(null), toastDuration);
      },
    });
  };

  return (
    <Form {...form}>
      <form className="flex items-center gap-12 shrink-0" onSubmit={(e) => e.preventDefault()}>
        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Notatka (opcjonalnie)"
              className="h-10 w-[300px] text-sm px-3 py-1 bg-surface/70 focus:bg-surface/90 rounded-md"
            />
          )}
        />

        <div className="flex space-x-4">
          {/* Message button */}
          <Button
            size="icon"
            variant={feedback === "message" ? "ghost" : "outline"}
            onClick={form.handleSubmit((data) => onSubmit(data, "message"))}
            disabled={loadingType === "message"}
            className="w-14 h-10 rounded-md transition-all hover:scale-105"
          >
            {loadingType === "message" ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : feedback === "message" ? (
              <CircleCheck className="w-5 h-5 text-green-600/85" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
          </Button>

          {/* Call button */}
          <Button
            size="icon"
            variant={feedback === "call" ? "ghost" : "outline"}
            onClick={form.handleSubmit((data) => onSubmit(data, "call"))}
            disabled={loadingType === "call"}
            className="w-14 h-10 rounded-md transition-all hover:scale-105"
          >
            {loadingType === "call" ? (
              <Loader2 className="animate-spin w-5 h-5" />
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
