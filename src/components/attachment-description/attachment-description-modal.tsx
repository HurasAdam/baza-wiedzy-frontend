import { Info, Loader } from "lucide-react";
import { useFindArticleAttachmentQuery } from "../../hooks/attachments/use-article-attachments";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Separator } from "../ui/separator";

interface AttachmentDescriptionModalProps {
  isArticleAttachmentDescriptionModalOpen: boolean;
  setIsArticleAttachmentDescriptionModalOpen: (isOpen: boolean) => void;
  closeOnOutsideClick?: boolean;
  attachmentId: string;
  articleId: string;
  onClose?: () => void;
}

export const AttachmentDescriptionModal = ({
  isArticleAttachmentDescriptionModalOpen,
  setIsArticleAttachmentDescriptionModalOpen,
  attachmentId,
  articleId,
  closeOnOutsideClick,
  onClose,
}: AttachmentDescriptionModalProps) => {
  const { data: attachment, isPending: isAttachmentLoading } = useFindArticleAttachmentQuery(articleId, attachmentId);

  const handleOpenChange = (open: boolean) => {
    setIsArticleAttachmentDescriptionModalOpen(open);
    if (!open && onClose) setTimeout(() => onClose?.(), 300);
  };

  return (
    <Dialog open={isArticleAttachmentDescriptionModalOpen} onOpenChange={handleOpenChange} modal>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="max-h-[80vh] min-w-[620px] overflow-y-auto p-6 rounded-2xl shadow-lg bg-card text-card-foreground"
      >
        {isAttachmentLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="animate-spin w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Ładowanie danych...</p>
          </div>
        ) : (
          attachment && (
            <>
              {/* Nagłówek */}
              <div className="flex items-center gap-2 mb-3">
                <Info />
                <span className="text-xs text-muted-foreground uppercase font-semibold ">Szczegóły załącznika</span>
              </div>

              <DialogHeader className="space-y-2 mb-4">
                <p className="text-xs text-muted-foreground ">
                  Tytuł pliku:{" "}
                  <span className="font-base text-foreground text-base">{attachment.title || "Brak tytułu"}</span>
                </p>
                <p className="text-sm text-muted-foreground ">
                  Nazwa pliku: <span className="font-medium  text-foreground">{attachment.filename}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Typ pliku: <span className="font-medium text-foreground ">{attachment.mimeType}</span>
                </p>
              </DialogHeader>
              <Separator className="my-2" />

              {/* Opis */}
              <section className="mb-2 p-3 bg-popover rounded-lg">
                <h3 className="text-sm font-semibold text-popover-foreground mb-1">Opis</h3>
                <p className="text-sm">{attachment.description || "Brak opisu"}</p>
              </section>

              <Separator className="my-4" />

              {/* Autor */}
              <section className="flex items-center gap-4 mb-4 p-3 bg-popover/30 rounded-lg border border-border">
                <Avatar className="w-14 h-14 ">
                  <AvatarImage
                    src={
                      attachment.uploadedBy?.profilePicture
                        ? `${
                            import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:5000"
                          }${attachment.uploadedBy.profilePicture.path.replace(/^\/app/, "")}`
                        : ""
                    }
                    alt="Avatar"
                    crossOrigin="anonymous"
                  />
                  <AvatarFallback className="bg-primary/25 text-primary">
                    {attachment.uploadedBy?.name?.[0]}
                    {attachment.uploadedBy?.surname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground mb-1">Autor</span>
                  <p className="font-medium">
                    {attachment.uploadedBy?.name} {attachment.uploadedBy?.surname}
                  </p>
                  <p className="text-xs text-muted-foreground">{attachment.uploadedBy?.email}</p>
                </div>
              </section>

              {/* Metadata */}
              <section className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-6">
                <div>
                  <p className="font-semibold">Dodano:</p>
                  <p>{new Date(attachment.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Rozmiar:</p>
                  <p>{(attachment.size / 1024).toFixed(2)} KB</p>
                </div>
              </section>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted/80"
                  onClick={() => setIsArticleAttachmentDescriptionModalOpen(false)}
                >
                  Zamknij
                </Button>
              </div>
            </>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};
