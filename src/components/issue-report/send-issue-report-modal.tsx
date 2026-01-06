import { useSendIssueReportMutation } from "@/hooks/issue-report/use-issue-report";
import type { AxiosError } from "axios";
import { ArrowLeft, Bug, Lightbulb } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import queryClient from "../../config/query.client";
import { jstProjectSchema } from "../../validation/jst-project.schema";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import BugReportForm from "./bug-report-form";
import IssueReportSelector from "./issue-report-selector";
import ProposalReportForm from "./proposal-report-form";

interface Props {
  closeOnOutsideClick?: boolean;
  isCreatingIssueReport: boolean;
  setIsCreatingIssueReport: (v: boolean) => void;
}

export type JstProjectForm = z.infer<typeof jstProjectSchema>;

const MODE_CONFIG = {
  bug: {
    title: "Zgłoś błąd aplikacji",
    description: "Opisz problem, który wystąpił podczas korzystania z aplikacji",
    icon: Bug,
    iconClass: "text-red-500",
  },
  proposal: {
    title: "Zaproponuj usprawnienie",
    description: "Podziel się pomysłem na nową funkcję lub ulepszenie",
    icon: Lightbulb,
    iconClass: "text-amber-500",
  },
};

export const SendIssueReportModal = ({
  closeOnOutsideClick = false,
  isCreatingIssueReport,
  setIsCreatingIssueReport,
}: Props) => {
  const [mode, setMode] = useState<"bug" | "proposal" | null>(null);
  const { mutate, isPending } = useSendIssueReportMutation();

  const onSubmit = (data) => {
    console.log(data);
    mutate(data, {
      onSuccess: () => {
        setIsCreatingIssueReport(false);
        toast.success("Zgłoszenie zostało wysłane", {
          description: "Dziękujemy za Twoją informację 🙌",
        });
        queryClient.invalidateQueries({ queryKey: ["issue-reports"] });
      },
      onError: (error) => {
        const { status } = error as AxiosError;
        if (status === 409) {
          toast.error("Takie zgłoszenie już istnieje");
          return;
        }
        toast.error("Wystąpił błąd, spróbuj ponownie");
      },
    });
  };

  const modeConfig = mode ? MODE_CONFIG[mode] : null;
  const Icon = modeConfig?.icon;

  return (
    <Dialog open={isCreatingIssueReport} onOpenChange={setIsCreatingIssueReport}>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="
        min-w-xl
        md:min-w-3xl
        xl:min-w-5xl
          w-[95vw] 
          min-h-[86vh]
          max-h-[86vh]
      p-0
      flex flex-col
      rounded-xl shadow-xl bg-background/95 backdrop-blur-sm border 
    "
        onAnimationEnd={(e) => {
          if (e.currentTarget.getAttribute("data-state") === "closed") {
            setMode(null);
          }
        }}
      >
        {/* HEADER */}
        {mode && modeConfig && (
          <DialogHeader className="rounded-t-xl border-b px-6 py-4 flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => setMode(null)}>
              <ArrowLeft />
            </Button>

            <div className="flex items-start gap-3">
              {Icon && (
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                  <Icon className={`h-5 w-5 ${modeConfig.iconClass}`} />
                </div>
              )}

              <div>
                <DialogTitle className="text-lg font-semibold">{modeConfig.title}</DialogTitle>
                <p className="text-sm text-muted-foreground">{modeConfig.description}</p>
              </div>
            </div>
          </DialogHeader>
        )}

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-custom">
          {mode === null ? (
            <IssueReportSelector onSelect={setMode} />
          ) : mode === "bug" ? (
            <BugReportForm onSend={onSubmit} isLoading={isPending} />
          ) : (
            <ProposalReportForm onSend={onSubmit} isLoading={isPending} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
