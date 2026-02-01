import {
  ArrowLeft,
  DownloadIcon,
  ExternalLinkIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  Info,
  LinkIcon,
  Loader,
  MoreVertical,
  Trash2,
  UploadIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "sonner";

import { motion } from "framer-motion";
import { ArticleAttachmentModal } from "../../../components/article-attachment/article-attachment-modal";
import { AttachmentDescriptionModal } from "../../../components/attachment-description/attachment-description-modal";
import { Alert } from "../../../components/shared/alert-modal";
import { NoDataFound } from "../../../components/shared/NoDataFound";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import queryClient from "../../../config/query.client";
import * as animation from "../../../constants/animations";
import { ERROR_MESSAGES } from "../../../constants/error-messages";
import {
  useDeleteArticleAttachmentMutation,
  useFindArticleAttachmentsQuery,
} from "../../../hooks/attachments/use-article-attachments";
import type { AttachmentListItem } from "../../../types/attachment";
import { assertDefined } from "../../../utils/asserts";
import {
  copyAttachmnentUrl,
  formatFileSize,
  getAttachmentUrl,
  mapMimeTypeToFileType,
  type FileType,
} from "../../../utils/fileHelpers";
import { formatDate } from "../../../utils/format-date";
import type { ArticleOutletContext } from "../../article/ArticleMainPage";

/* ---------------- helpers ---------------- */

function getFileIcon(fileType: FileType) {
  const baseClass = "w-6 h-6";
  switch (fileType) {
    case "pdf":
      return <FileTextIcon className={`${baseClass} text-[#B74C4C]`} />;
    case "ppt":
      return <FileIcon className={`${baseClass} text-[#C48B5F]`} />;
    case "img":
      return <ImageIcon className={`${baseClass} text-[#4C7EBB]`} />;
    case "txt":
      return <FileTextIcon className={`${baseClass} text-[#6E6E6E]`} />;
    case "xls":
      return <FileIcon className={`${baseClass} text-[#4C7E4C]`} />;
    default:
      return <FileIcon className={`${baseClass} text-[#7A7A7A]`} />;
  }
}

export type ActionType = "DELETE_ATTACHMENT" | "SHOW_ATTACHMENT_DETAILS";
export interface PendingAction {
  type: ActionType;
  attachment: AttachmentListItem;
}

/* ---------------- component ---------------- */

export const Articlev2AttachmentsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { article } = useOutletContext<ArticleOutletContext>();

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isArticleAttachmentModalOpen, setIsArticleAttachmentModalOpen] = useState(false);

  const { data: attachments = [], isLoading: isAttachmentsListLoading } = useFindArticleAttachmentsQuery(id!);

  const { mutate: deleteSelectedArticleAttachmentMutate, isPending: isArticleAttachmentDeleteLoading } =
    useDeleteArticleAttachmentMutation();

  const openAttachmentModal = () => setIsArticleAttachmentModalOpen(true);

  const onAttachmentDeleteRequest = (attachment: AttachmentListItem) =>
    setPendingAction({ type: "DELETE_ATTACHMENT", attachment });

  const onShowAttachmentDescriptionRequest = (attachment: AttachmentListItem) =>
    setPendingAction({ type: "SHOW_ATTACHMENT_DETAILS", attachment });

  const onAttachmentDeleteConfirm = (attachmentId: string) => {
    assertDefined(attachmentId, ERROR_MESSAGES.ATTACHMENT.MISSING_ID);
    deleteSelectedArticleAttachmentMutate(attachmentId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["articles-attachments", id] });
        toast.success("Załącznik został usunięty");
      },
    });
  };

  const handleDownload = async (attachment: AttachmentListItem) => {
    try {
      const response = await fetch(getAttachmentUrl(attachment));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = attachment.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Błąd pobierania pliku:", err);
    }
  };

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="space-y-8 mx-auto"
    >
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="w-16 h-16 flex items-center justify-center rounded-lg hover:bg-muted/30 bg-background"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-8 h-8" />
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-foreground/95 break-words">{article.title}</h1>
            <p className="text-sm text-muted-foreground">Zarządzanie załącznikami artykułu</p>
          </div>
        </div>
        <Button onClick={openAttachmentModal} size="sm" className="flex items-center gap-2">
          <UploadIcon className="w-4 h-4" /> Dodaj załącznik
        </Button>
      </div>

      {/* ===== LISTA ZAŁĄCZNIKÓW ===== */}
      {isAttachmentsListLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : attachments.length === 0 ? (
        <NoDataFound
          title="Brak załączników"
          description="Ten artykuł nie ma jeszcze żadnych załączników."
          buttonText="Dodaj załącznik"
          buttonAction={openAttachmentModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {attachments.map((file) => {
            const type = mapMimeTypeToFileType(file.mimeType);
            return (
              <Card
                key={file._id}
                className="flex flex-col justify-between p-4 shadow-sm border hover:shadow-lg transition rounded-lg bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    {getFileIcon(type)}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold truncate">{file.title ?? file.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleDownload(file)}>
                      <DownloadIcon className="w-4 h-4 mr-1" /> Pobierz
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.open(getAttachmentUrl(file), "_blank")}>
                      <FileIcon className="w-4 h-4 mr-1" /> Otwórz
                    </Button>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => handleDownload(file)}>
                        <DownloadIcon className="w-4 h-4 mr-2" /> Pobierz
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(getAttachmentUrl(file), "_blank")}>
                        <ExternalLinkIcon className="w-4 h-4 mr-2" /> Otwórz
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyAttachmnentUrl(file, () => toast.success("Link skopiowany!"))}
                      >
                        <LinkIcon className="w-4 h-4 mr-2" /> Kopiuj link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onShowAttachmentDescriptionRequest(file)}>
                        <Info className="w-4 h-4 mr-2" /> Szczegóły
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAttachmentDeleteRequest(file)} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Usuń
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ===== MODALE ===== */}
      <ArticleAttachmentModal
        isOpen={isArticleAttachmentModalOpen}
        onOpenChange={setIsArticleAttachmentModalOpen}
        articleId={id!}
      />

      {pendingAction?.type === "SHOW_ATTACHMENT_DETAILS" && (
        <AttachmentDescriptionModal
          isArticleAttachmentDescriptionModalOpen
          setIsArticleAttachmentDescriptionModalOpen={(open) => !open && setPendingAction(null)}
          attachmentId={pendingAction.attachment._id}
          articleId={pendingAction.attachment.ownerId}
          onClose={() => setPendingAction(null)}
        />
      )}

      {pendingAction?.type === "DELETE_ATTACHMENT" && (
        <Alert
          requireConfirmation
          isConfirmEnabled
          isOpen
          type="warning"
          title="Potwierdź usunięcie załącznika"
          onCancel={() => setPendingAction(null)}
          onConfirm={() => {
            onAttachmentDeleteConfirm(pendingAction.attachment._id);
            setPendingAction(null);
          }}
          isLoading={isArticleAttachmentDeleteLoading}
        >
          <>
            Usunięcie załącznika <strong>{pendingAction.attachment.title || pendingAction.attachment.filename}</strong>{" "}
            spowoduje trwałe usunięcie pliku z systemu.
            <br />
            Czy na pewno chcesz kontynuować?
          </>
        </Alert>
      )}
    </motion.div>
  );
};
