import type { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import type { AxiosError } from "axios";
import { ArrowBigLeftIcon } from "lucide-react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { jstProjectSchema } from "../../validation/jst-project.schema";
import IssueReportSelector from "./issue-report-selector";
import { useState } from "react";
import ProposalReportForm from "./proposal-report-form";
import BugReportForm from "./bug-report-form";
import { useSendIssueReportMutation } from "@/hooks/issue-report/use-issue-report";

interface CreateWorkspaceProps {
  closeOnOutsideClick?: boolean;
  isCreatingIssueReport: boolean;
  setIsCreatingIssueReport: (isCreatingIssueReport: boolean) => void;
}

export type JstProjectForm = z.infer<typeof jstProjectSchema>;

export const SendIssueReportModal = ({
  closeOnOutsideClick = false,
  isCreatingIssueReport,
  setIsCreatingIssueReport,
}: CreateWorkspaceProps) => {
  const [mode, setMode] = useState<"bug" | "proposal" | null>(null);
  const { mutate, isPending } = useSendIssueReportMutation();
  const onSubmit = (data: JstProjectForm) => {
    mutate(data, {
      onSuccess: () => {
        setIsCreatingIssueReport(false);
        toast.success("Zgłoszenie zostało przesłane pomyślnie.", {
          description: "Dziękujemy za przesłanie informacji.",
          duration: 5000,
        });
        queryClient.invalidateQueries({ queryKey: ["issue-reports"] });
      },
      onError: (error) => {
        const { status } = error as AxiosError;
        if (status === 409) {
          toast.error(
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontFamily: "Inter, sans-serif",
                color: "#991b1b",
                fontSize: "14px",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>
                  Błąd: Duplikat nazwy projektu
                </div>
                <div style={{ opacity: 0.8 }}>
                  Projekt o podanej nazwie już istnieje. Wybierz inną nazwę.
                </div>
              </div>
            </div>,
            { duration: 7000 }
          );
          return;
        }

        toast.error("Wystapił błąd, spróbuj ponownie");
      },
    });
  };

  return (
    <Dialog
      open={isCreatingIssueReport}
      onOpenChange={setIsCreatingIssueReport}
      modal={true}
    >
      <DialogContent
        onAnimationEnd={(e) => {
          if (e.currentTarget.getAttribute("data-state") === "closed") {
            setMode(null);
          }
        }}
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
        className="min-h-[84vh] max-h-[84vh] overflow-y-auto scrollbar-custom  min-w-5xl w-full"
      >
        {mode === null ? (
          <IssueReportSelector onSelect={setMode} />
        ) : (
          <div className="space-y-3 bg-background h-full">
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => setMode(null)}>
                <ArrowBigLeftIcon size={19} />
              </Button>
            </div>
            {mode === "bug" ? (
              <BugReportForm onSend={onSubmit} isLoading={isPending} />
            ) : (
              <ProposalReportForm onSend={onSubmit} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
