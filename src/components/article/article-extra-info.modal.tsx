import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ArticleInfoModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  article: any;
}

export const ArticleExtraInfoModal = ({ isOpen, setIsOpen, article }: ArticleInfoModalProps) => {
  if (!article) return null;

  const getStatusBadge = () => {
    switch (article.status) {
      case "approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center whitespace-nowrap">
            <CheckCircleIcon className="w-4 h-4 mr-1" /> Zweryfikowany
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center whitespace-nowrap">
            <XCircleIcon className="w-4 h-4 mr-1" /> Wymaga weryfikacji
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-destructive/10 text-rose-800/95 border border-destructive/30 flex items-center whitespace-nowrap">
            <XCircleIcon className="w-4 h-4 mr-1" /> Wymaga zatwierdzenia
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive/10 text-rose-800/95 border border-destructive/30 flex items-center whitespace-nowrap">
            <XCircleIcon className="w-4 h-4 mr-1" /> Odrzucony
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderAvatar = (user: any) => (
    <Avatar className="w-12 h-12 rounded-full ring-1 ring-border bg-primary">
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
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="max-w-md w-full p-6 rounded-2xl shadow-lg bg-background">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Dodatkowe informacje</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          {getStatusBadge()}

          <div>
            <h3 className="text-sm font-semibold mb-2">Autor</h3>
            <div className="flex items-center gap-3">
              {renderAvatar(article.createdBy)}
              <div className="text-sm">
                <div className="font-medium">{`${article.createdBy.name} ${article.createdBy.surname}`}</div>
                <div className="text-muted-foreground text-xs">Autor artykułu</div>
              </div>
            </div>
          </div>

          {article.status === "approved" && article.verifiedBy ? (
            <div>
              <h3 className="text-sm font-semibold mb-2">Zweryfikowany przez</h3>
              <div className="flex items-center gap-3">
                {renderAvatar(article.verifiedBy)}
                <div className="text-sm">
                  <div className="font-medium">{`${article.verifiedBy.name} ${article.verifiedBy.surname}`}</div>
                  <div className="text-muted-foreground text-xs">Zweryfikował</div>
                </div>
              </div>
            </div>
          ) : article.status !== "approved" ? (
            <div className="text-sm text-yellow-700 font-medium">Artykuł nie został jeszcze zatwierdzony</div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
