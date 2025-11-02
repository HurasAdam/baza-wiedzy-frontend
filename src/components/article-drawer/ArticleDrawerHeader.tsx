import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { SheetHeader, SheetTitle } from "../ui/sheet";

const ArticleDrawerHeader = ({ article }) => {
  return (
    <SheetHeader className="border-b border-border pb-3">
      <SheetTitle className="text-xl font-semibold text-foreground">
        {article ? article.title : "Podgląd artykułu"}
      </SheetTitle>

      {article && (
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {article.status === "approved" && (
              <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center whitespace-nowrap">
                <CheckCircleIcon className="w-4 h-4 mr-1" /> Zweryfikowany
              </Badge>
            )}
            {article.status === "pending" && (
              <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center whitespace-nowrap">
                <XCircleIcon className="w-4 h-4 mr-1" /> Wymaga weryfikacji
              </Badge>
            )}
            {(article.status === "draft" || article.status === "rejected") && (
              <Badge className="bg-destructive/10 text-rose-800/95 border border-destructive/30 flex items-center whitespace-nowrap">
                <XCircleIcon className="w-4 h-4 mr-1" />
                {article.status === "draft" ? "Wymaga zatwierdzenia" : "Odrzucony"}
              </Badge>
            )}
          </div>

          <span className="text-sm text-muted-foreground">
            {article.product?.name ?? "Brak produktu"} • {article.category?.name ?? "Brak kategorii"}
          </span>
        </div>
      )}
    </SheetHeader>
  );
};

export default ArticleDrawerHeader;
