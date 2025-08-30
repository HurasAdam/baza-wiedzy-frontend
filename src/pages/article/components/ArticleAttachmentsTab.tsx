import {
  DownloadIcon,
  FileIcon,
  FileTextIcon,
  FolderDown,
  ImageIcon,
  LinkIcon,
  Loader,
  MoreVertical,
  Trash2,
  UploadIcon,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArticleAttachmentModal } from "../../../components/article-attachment/article-attachment-modal";
import { AttachmentDescriptionModal } from "../../../components/attachment-description/attachment-description-modal";
import { Alert } from "../../../components/shared/alert-modal";
import { NoDataFound } from "../../../components/shared/NoDataFound";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import queryClient from "../../../config/query.client";
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

function getFileIcon(fileType: FileType) {
  switch (fileType) {
    case "pdf":
      return <FileTextIcon className="w-6 h-6 text-[#B74C4C]" />;
    case "ppt":
      return <FileIcon className="w-6 h-6 text-[#C48B5F]" />;
    case "img":
      return <ImageIcon className="w-6 h-6 text-[#4C7EBB]" />;
    case "txt":
      return <FileTextIcon className="w-6 h-6 text-[#6E6E6E]" />;
    case "xls":
      return <FileIcon className="w-6 h-6 text-[#4C7E4C]" />;
    default:
      return <FileIcon className="w-6 h-6 text-[#7A7A7A]" />;
  }
}

export type ActionType = "DELETE_ATTACHMENT" | "SHOW_ATTACHMENT_DETAILS";
export interface PendingAction {
  type: ActionType;
  attachment: AttachmentListItem;
}

const ArticleAttachmentsTab = () => {
  const { id } = useParams<{ id: string }>();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>();
  const [isArticleAttachmentModalOpen, setIsArticleAttachmentModalOpen] = useState<boolean>(false);

  const { data: attachments = [], isLoading: isAttachmentsListLoading } = useFindArticleAttachmentsQuery(id!);
  const { mutate: deleteSelectedArticleAttachmentMutate, isPending: isArticleAttachmentDeleteLoading } =
    useDeleteArticleAttachmentMutation();

  const openAttachmentModal = () => {
    setIsArticleAttachmentModalOpen(true);
  };

  const onAttachmentDeleteRequest = (attachment: AttachmentListItem) =>
    setPendingAction({ type: "DELETE_ATTACHMENT", attachment });

  const onShowAttachmentDescriptionRequest = (attachment: AttachmentListItem) => {
    setPendingAction({ type: "SHOW_ATTACHMENT_DETAILS", attachment });
  };

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
      a.click(); // wywołanie pobrania
      a.remove();
      window.URL.revokeObjectURL(url); // sprzątanie
    } catch (err) {
      console.error("Błąd pobierania pliku:", err);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between py-3 px-4 border-b">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <FolderDown className="w-5 h-5" /> Załączone pliki
        </h3>
        <Button onClick={openAttachmentModal} size="sm">
          <UploadIcon className="w-4 h-4 mr-2" />
          Dodaj załącznik
        </Button>
      </div>
      <Card className="mt-6 p-0 ">
        <CardContent className="divide-y divide-border p-0">
          {isAttachmentsListLoading ? (
            // 👉 spinner zamiast NoDataFound
            <div className="flex justify-center items-center py-12">
              <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : attachments.length === 0 ? (
            // 👉 NoDataFound tylko jeśli nie ma wyników i nie trwa loading
            <NoDataFound
              title="Brak załączników"
              description="Ten artykuł nie ma jeszcze żadnych załączników."
              buttonText="Dodaj załącznik"
              buttonAction={openAttachmentModal}
            />
          ) : (
            attachments.map((file: AttachmentListItem) => {
              const type = mapMimeTypeToFileType(file.mimeType);
              return (
                <div
                  key={file._id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  {/* Ikona + info */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      {getFileIcon(type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.title ?? file.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ">
                    <Button
                      className="group hover:text-primary"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(file)}
                    >
                      <DownloadIcon className="w-4 h-4 mr-1 group-hover:text-primary" />
                      Pobierz
                    </Button>

                    {/* Otwórz w nowej karcie */}
                    <Button
                      className="group hover:text-primary"
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(getAttachmentUrl(file), "_blank")}
                    >
                      <FileIcon className="w-4 h-4 mr-1 group-hover:text-primary" />
                      Otwórz
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleDownload(file)}>
                          <DownloadIcon className="w-4 h-4 mr-2" /> Pobierz
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(getAttachmentUrl(file), "_blank")}>
                          <FileIcon className="w-4 h-4 mr-2" /> Otwórz
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => copyAttachmnentUrl(file, () => toast.success("Link skopiowany!"))}
                        >
                          <LinkIcon className="w-4 h-4 mr-2" /> Kopiuj link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onShowAttachmentDescriptionRequest(file)}>
                          <LinkIcon className="w-4 h-4 mr-2" /> Szczegóły
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAttachmentDeleteRequest(file)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" /> Usuń
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <ArticleAttachmentModal
        isOpen={isArticleAttachmentModalOpen}
        onOpenChange={setIsArticleAttachmentModalOpen}
        articleId={id!}
        onUploaded={() => {
          // refetch listy załączników
          // np. queryClient.invalidateQueries({ queryKey: ["article-attachments", articleId] })
        }}
      />

      {pendingAction && pendingAction.attachment && pendingAction.type === "SHOW_ATTACHMENT_DETAILS" && (
        <AttachmentDescriptionModal
          isArticleAttachmentDescriptionModalOpen={true}
          setIsArticleAttachmentDescriptionModalOpen={(open) => !open && setPendingAction(null)}
          attachmentId={pendingAction.attachment._id}
          articleId={pendingAction.attachment.ownerId}
          onClose={() => setPendingAction(null)}
        />
      )}
      {pendingAction && (
        <Alert
          requireConfirmation
          isOpen={pendingAction.type === "DELETE_ATTACHMENT"}
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
            Usunięcie załącznika
            <strong>{pendingAction.attachment.title || pendingAction.attachment.filename}</strong>
            {pendingAction.attachment.title && (
              <span className="block text-xs text-muted-foreground">({pendingAction.attachment.filename})</span>
            )}
            spowoduje trwałe usunięcie pliku z systemu i będzie nieodwracalne.
            <br />
            Czy na pewno chcesz kontynuować?
          </>
        </Alert>
      )}
    </div>
  );
};

export default ArticleAttachmentsTab;
