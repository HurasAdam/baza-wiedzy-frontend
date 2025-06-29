import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Loader2, Mail, Phone } from "lucide-react";
import { useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "../../../components/ui/button";
import { DialogFooter } from "../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useCreateReportTopicMutation } from "../../../hooks/report-topic/use-report-topic";
import type { ITopic } from "../../../types/topic";
import { reportTopicSchema } from "../../../validation/report-topic.schema";

export type reportTopicForm = z.infer<typeof reportTopicSchema>;

interface IRegisterTopicFormProps {
  topic: ITopic;
}

const RegisterTopicForm = ({ topic }: IRegisterTopicFormProps) => {
  const [feedback, setFeedback] = useState<null | "call" | "message">(null);
  const [loadingType, setLoadingType] = useState<null | "call" | "message">(
    null
  );
  const form = useForm<reportTopicForm>({
    resolver: zodResolver(reportTopicSchema),
    defaultValues: {
      description: "",
      topic: topic ? topic?._id : "",
    },
  });

  const { mutate, isPending } = useCreateReportTopicMutation();

  const onSubmit = (data: reportTopicForm, type: "call" | "message") => {
    const finalData = {
      ...data,
      type,
    };

    mutate(finalData, {
      onSuccess: () => {
        setFeedback(type);
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
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: "2px",
                  fontSize: "14px",
                }}
              >
                Zgłoszenie zapisane
              </div>
              <div style={{ opacity: 0.8, fontSize: "13px" }}>
                Twoje zgłoszenie dla tematu{" "}
                <span style={{ fontWeight: 500, color: "#111827" }}>
                  “{topic?.title}”
                </span>{" "}
                zostało pomyślnie dodane.
              </div>
            </div>
          </div>,
          { duration: 2000 }
        );

        setTimeout(() => {
          setFeedback(null);
        }, 1000);
      },
    });
  };
  return (
    <Form {...form}>
      <form className="flex items-center space-x-3  w-1/2 my-auto">
        <div className="pt-1.5 pb-1.5  w-full">
          {/* ------ description ----- */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-foreground">
                  Notatka
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-4"
                    {...field}
                    placeholder="Notatka (opcjonalnie)"
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* --------- name ------- */}
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem hidden={true}>
                <FormControl>
                  <Input hidden={true} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="mt-4 flex space-x-1.5">
          <AnimatedButton
            ariaLabel="Send message report"
            loading={loadingType === "message"}
            success={feedback === "message"}
            onClick={() =>
              form.handleSubmit((data) => onSubmit(data, "message"))()
            }
            icon={
              isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Mail className="w-6 h-6" />
              )
            }
          />
          <AnimatedButton
            ariaLabel="Send call report"
            loading={loadingType === "call"}
            success={feedback === "call"}
            onClick={() =>
              form.handleSubmit((data) => onSubmit(data, "call"))()
            }
            icon={<Phone className="w-6 h-6" />}
          />
        </DialogFooter>
      </form>
    </Form>
  );
};

export default RegisterTopicForm;

const AnimatedButton = ({
  icon,
  onClick,
  loading,
  success,
  ariaLabel,
}: {
  icon: JSX.Element;
  onClick: () => void;
  loading: boolean;
  success: boolean;
  ariaLabel: string;
}) => {
  return (
    <Button
      variant="outline"
      type="button"
      size="icon"
      onClick={onClick}
      disabled={loading || success}
      aria-label={ariaLabel}
      className={`disabled:opacity-100 relative w-12 h-12 rounded-lg  transition-colors duration-300 cursor-pointer
        ${success ? "bg-primary text-foreground" : "  text-foreground "}
      `}
    >
      {/* Success Checkmark */}
      {success && (
        <CircleCheck className="w-16 h-16 mx-auto text-foreground " />
      )}

      {/* Default Icon */}
      {!loading && !success && icon}
    </Button>
  );
};
