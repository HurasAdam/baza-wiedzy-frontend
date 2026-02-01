import {
  useFindReportCommentsQuery,
  useSendIssueReportCommentMutation,
} from "@/hooks/issue-report-comments/use-issue-report-comment";
import { useFindIssueReportQuery } from "@/hooks/issue-report/use-issue-report";
import type { AxiosError } from "axios";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import * as animation from "../../constants/animations";
import { useAuthQuery } from "../../hooks/auth/use-auth";
import { CommentFormSection } from "./components/CommentFormSection";
import { CommentListSection } from "./components/CommentListSection";
import { DetailsSection } from "./components/DetailsSection";
import { Header } from "./components/Header";

export function ReportDetailsPage() {
  const { id } = useParams();
  const { data: report, isLoading } = useFindIssueReportQuery(id!);
  const { data: comments = [] } = useFindReportCommentsQuery(id!);
  const { data: user } = useAuthQuery();

  const userPermissions = user?.role?.permissions || [];

  const [comment, setComment] = useState("");
  const { mutate: sendCommentMutate, isPending: isSubmitting } = useSendIssueReportCommentMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  if (!report) {
    return <p className="text-center py-20 text-muted-foreground">Nie znaleziono zgłoszenia</p>;
  }

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    sendCommentMutate(
      { reportId: report._id, payload: comment.trim() },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["report-comments", report._id] });
          setComment("");
          toast.info("Dodano komentarz", { position: "bottom-right" });
        },
        onError: (error) => {
          const { status } = error as AxiosError;

          if (status === 403) {
            toast.error("Brak uprawnień", {
              description: "Nie posiadasz wymaganych uprawnień do wykonania tej operacji.",
              position: "bottom-right",
              duration: 7000,
            });
            return;
          }

          toast.error("Wystapił błąd, spróbuj ponownie");
        },
      },
    );
  };

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="max-w-[1320px] mx-auto h-full"
    >
      <Header report={report} canManageReportStatus={userPermissions.includes("MANAGE_REPORT_STATUS")} />

      <DetailsSection report={report} />

      <CommentFormSection
        value={comment}
        onChange={setComment}
        onSubmit={handleSubmitComment}
        loading={isSubmitting}
        canAddComment={userPermissions.includes("ADD_REPORT_COMMENT")}
      />

      <CommentListSection comments={comments} onDeleteComment={() => {}} onEditComment={() => {}} />
    </motion.div>
  );
}
