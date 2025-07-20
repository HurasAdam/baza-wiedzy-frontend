import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { cn } from "../../../lib/utils";

const statusLabels: Record<string, string> = {
  approved: "Zatwierdzony",
  pending: "Oczekujący",
  rejected: "Odrzucony",
};

export interface Article {
  _id: string;
  title: string;
  tags: Tag[];
  isVerified: boolean;
  status: "approved" | "rejected" | "pending";
  rejectionReason: string | null;
  rejectedBy: Author | null;
  createdBy: Author;
  viewsCounter: number;
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

interface MyEntryCardProps {
  onOpenRejectionReason: (article: Article) => void;
  article: Article;
  label: "approved" | "rejected" | "pending";
}

const MyEntryCard = ({
  article,
  label,
  onOpenRejectionReason,
}: MyEntryCardProps) => {
  const navigate = useNavigate();
  const onPreview = () => {
    navigate(`/articles/${article._id}`);
  };

  const renderStatus = () => {
    const baseClasses = "text-xs font-medium px-2 py-0.5 rounded";

    const statusColor = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
    }[label];

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(baseClasses, statusColor)}>
            {statusLabels[label]}
          </span>
        </TooltipTrigger>
        {label === "rejected" && article.rejectedBy && (
          <TooltipContent className="text-sm p-3">
            <div>
              <span className="font-semibold">Odrzucony przez:</span>{" "}
              {article.rejectedBy.name} {article.rejectedBy.surname}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    );
  };

  return (
    <>
      <div
        key={article._id}
        className="flex justify-between items-center px-4 py-3 text-sm hover:bg-muted transition-colors rounded-md"
      >
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium text-foreground truncate">
            {article.title}
          </span>
          <span className="text-muted-foreground text-xs">
            {article.product.name}
          </span>
        </div>

        <div className="flex items-center gap-6">
          {renderStatus()}
          {label === "rejected" && article.rejectionReason && (
            <Button
              size="sm"
              variant="link"
              className="text-sm text-muted-foreground hover:text-primary underline-offset-2"
              onClick={() => onOpenRejectionReason(article)}
            >
              Uwagi
            </Button>
          )}

          <Button onClick={onPreview} size="sm" className="cursor-pointer">
            Wyświetl
          </Button>
        </div>
      </div>
    </>
  );
};

export default MyEntryCard;
