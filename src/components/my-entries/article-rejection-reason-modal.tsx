import { Info } from "lucide-react";
import type { ArticleData } from "../../pages/articlev2/ArticleMainPage/components/ArticleStatusBannerSection";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface ArticleRejectionReasonModalProps {
  article: ArticleData;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const ArticleRejectionReasonModal = ({ article, open, setOpen }: ArticleRejectionReasonModalProps) => {
  const rejectionNote = article.rejectionNote;
  const author = rejectionNote?.createdBy;
  const targetUser = rejectionNote?.targetUser;

  const renderAvatar = (user: any, ringColor = "ring-yellow-400") => (
    <Avatar className={`w-12 h-12 rounded-full ring-2 ${ringColor} bg-background`}>
      <AvatarImage
        src={`/api/avatar/${user._id}`}
        className="object-cover rounded-full"
        alt={`${user.name} ${user.surname}`}
      />
      <AvatarFallback className="w-full h-full rounded-full bg-primary text-foreground flex items-center justify-center text-lg font-bold">
        {user.name?.[0]}
        {user.surname?.[0]}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className="max-w-md min-w-xl w-full p-8 rounded-2xl shadow-xl bg-background">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Info className="w-5 h-5 text-muted-foreground" />
            Uwagi do zmian w artykule
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Poniżej znajdują się uwagi i sugestie wymagające poprawy.
          </DialogDescription>
        </DialogHeader>

        {author && (
          <div className="flex flex-col items-start gap-3 mb-8">
            <div className="text-xs text-muted-foreground uppercase font-medium">Autor uwag</div>
            <div className="flex items-center gap-4">
              {renderAvatar(author, "ring-foreground/75")}
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">{`${author.name} ${author.surname}`}</span>
                {author.email && <span className="text-xs text-muted-foreground">{author.email}</span>}
              </div>
            </div>

            <div className="bg-card text-foreground/90 rounded-xl p-5 border relative w-full mt-4">
              {rejectionNote?.text || "Brak szczegółów."}
              <div className="absolute left-0 -ml-4 top-6 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-card"></div>
            </div>
          </div>
        )}

        {targetUser && (
          <div className="text-sm text-foreground/70">
            <div className="font-medium mb-2">Uwaga dotyczy zmian wprowadzonych przez:</div>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 rounded-full ring-1 ring-border bg-muted/30">
                <AvatarFallback className="flex items-center justify-center text-sm font-bold text-foreground">
                  {targetUser.name?.[0]}
                  {targetUser.surname?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span>{`${targetUser.name} ${targetUser.surname}`}</span>
                {targetUser.email && <span className="text-xs text-muted-foreground">{targetUser.email}</span>}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArticleRejectionReasonModal;
