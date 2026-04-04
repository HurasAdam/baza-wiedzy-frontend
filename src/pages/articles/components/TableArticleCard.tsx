import { FileText, List, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../lib/utils";

export interface Article {
  _id: string;
  title: string;
  tags: Tag[];
  isVerified: boolean;
  lastVerifiedAt: string;
  isImportant: boolean;
  status: "approved" | "rejected" | "pending";
  rejectionReason: string | null;
  rejectedBy: string | null;
  createdBy: Author;
  viewsCounter: number;
  responseVariantsCount: number;
  isTrashed: boolean;
  product: Product;
  category: Category;
  createdAt: string;
  isFavourite: boolean;
}

interface Tag {
  _id: string;
  name: string;
}
interface Author {
  _id: string;
  name: string;
  surname: string;
}
interface Product {
  _id: string;
  name: string;
  labelColor: string;
  banner: string;
}
interface Category {
  _id: string;
  name: string;
}
interface Flag {
  _id: string;
  name: string;
  labelColor: string;
}

interface TableArticleCardProps {
  article: Article;
  flags: Flag[];
  onFlagChange: (articleId: string, flagId: string) => void;
  toggleFavourite: (id: string) => void;
  toggleFavouriteLoading: boolean;
  openArticleDrawer: (articleId: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const TableArticleCard = ({ article, openArticleDrawer, onMouseEnter, onMouseLeave }: TableArticleCardProps) => {
  const navigate = useNavigate();

  const getVerifiedText = (lastVerifiedAt: string | null, status: string) => {
    if (!lastVerifiedAt || status === "draft") return "Wymaga weryfikacji";

    const lastDate = new Date(lastVerifiedAt);
    const now = new Date();
    const diffTime = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Zweryfikowano dziś";
    if (diffDays === 1) return "Zweryfikowano 1 dzień temu";
    if (diffDays < 5) return `Zweryfikowano ${diffDays} dni temu`;
    if (diffDays < 365) return `Zweryfikowano ${diffDays} dni temu`;
    return "Zweryfikowano ponad rok temu";
  };

  return (
    <div
      onMouseEnter={() => onMouseEnter?.()}
      onMouseLeave={() => onMouseLeave?.()}
      onClick={() =>
        navigate(`/articles/${article._id}`, {
          state: { from: location.pathname + location.search },
        })
      }
      className={cn(
        "group flex items-center justify-between gap-4 px-5 pt-4 pb-3 cursor-pointer ",
        "border-b last:border-0 border-border/85",
        "bg-card/50 hover:bg-card/60",
        "transition-all duration-200",
        "hover:bg-muted/45 ",
      )}
    >
      {/* LEFT */}
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* ICON */}
        <div
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
            "border bg-muted/40 transition-all duration-200",
          )}
        >
          <FileText className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* CONTENT */}
        <div className="flex flex-col min-w-0">
          {/* TITLE */}
          <span className="text-[15.5px] font-semibold text-foreground/90 leading-snug line-clamp-2 group-hover:text-foreground">
            {article.title}
          </span>

          {/* META */}
          <div className="mt-1 text-[12.5px] text-muted-foreground flex items-center gap-2">
            <span className="ml-0.5">{article.category.name}</span>
            {article.lastVerifiedAt && (
              <>
                <span className="opacity-40">•</span>
                <span className="text-muted-foreground text-[12px]">
                  {getVerifiedText(article.lastVerifiedAt, article.status)}
                </span>
              </>
            )}

            {article.isImportant && (
              <>
                <span className="opacity-40">•</span>
                <span className="flex items-center gap-1 text-yellow-600/90">
                  <Star className="w-3 h-3" />
                  ważne
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* VARIANTS */}
        {article.responseVariantsCount > 1 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-muted/20 border border-border/40">
            <List className="w-3 h-3 opacity-70" />
            {article.responseVariantsCount}
          </div>
        )}

        {/* PRODUCT */}
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium truncate"
          style={{
            backgroundColor: `${article.product.labelColor}19`,
            color: `${article.product.labelColor}`,
          }}
        >
          <span className="truncate max-w-[120px]">{article.product.name}</span>
        </span>
      </div>
    </div>
  );
};
export default TableArticleCard;
