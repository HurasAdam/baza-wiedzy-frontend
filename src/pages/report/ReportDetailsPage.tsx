import {
  useFindReportCommentsQuery,
  useSendIssueReportCommentMutation,
} from "@/hooks/issue-report-comments/use-issue-report-comment";
import { useFindIssueReportQuery } from "@/hooks/issue-report/use-issue-report";

import { Loader } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { CommentFormSection } from "./components/CommentFormSection";
import { CommentListSection } from "./components/CommentListSection";

import { DetailsSection } from "./components/DetailsSection";
import { Header } from "./components/Header";

export function ReportDetailsPage() {
  const { id } = useParams();
  const { data: report, isLoading } = useFindIssueReportQuery(id!);
  const { data: comments = [] } = useFindReportCommentsQuery(id!);

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
      }
    );
  };

  return (
    <div className="mx-auto max-w-[1400px] h-full">
      <Header report={report} />

      <DetailsSection report={report} />

      <CommentFormSection value={comment} onChange={setComment} onSubmit={handleSubmitComment} loading={isSubmitting} />

      <CommentListSection comments={comments} onDeleteComment={() => {}} onEditComment={() => {}} />
    </div>
  );
}
