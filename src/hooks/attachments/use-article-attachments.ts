import { useMutation, useQuery } from "@tanstack/react-query";
import { articleAttachmentsService } from "../../services/attachments/article-attachments.service";

export const useUploadArticleAttachmentMutation = () => {
  return useMutation({
    mutationFn: (data) => articleAttachmentsService.uploadArticleAttachment(data),
  });
};

export const useDeleteArticleAttachmentMutation = () => {
  return useMutation({
    mutationFn: (attachmentId: string) => articleAttachmentsService.deleteSelectedArticleAttachment(attachmentId),
  });
};

export const useFindArticleAttachmentsQuery = (articleId: string) => {
  return useQuery({
    queryKey: ["articles-attachments", articleId],
    queryFn: () => {
      return articleAttachmentsService.findArticleAttachments(articleId);
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindArticleAttachmentQuery = (articleId: string, attachmentId: string) => {
  return useQuery({
    queryKey: ["articles-attachment", articleId],
    queryFn: () => {
      return articleAttachmentsService.findOneArticleAttachment(articleId, attachmentId);
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
