import API from "../../config/api.client";
import type { ArticleAttachment, AttachmentListItem } from "../../types/attachment";

const baseUrl = "/attachments/articles";

export const uploadArticleAttachment = async ({ articleId, formData }) => {
  return await API.post(`${baseUrl}/${articleId}`, formData);
};

export const findArticleAttachments = async (articleId: string): Promise<AttachmentListItem[]> => {
  return API.get(`${baseUrl}/${articleId}`);
};

export const findOneArticleAttachment = async (articleId: string, attachmentId: string): Promise<ArticleAttachment> => {
  return API.get(`${baseUrl}/${articleId}/attachment/${attachmentId}`);
};
export const deleteSelectedArticleAttachment = async (attachmentId: string) => {
  return API.delete(`${baseUrl}/${attachmentId}`);
};

export const articleAttachmentsService = {
  uploadArticleAttachment,
  findArticleAttachments,
  findOneArticleAttachment,
  deleteSelectedArticleAttachment,
};
