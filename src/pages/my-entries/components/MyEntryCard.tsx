import { Box } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipTrigger } from "../../../components/ui/tooltip";
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
  rejectionNote: {
    text: string;
    createdBy: unknown;
    createdAt: string;
  } | null;
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
  article: Article;
  label: "approved" | "rejected" | "pending";
}

const MyEntryCard = ({ article, label }: MyEntryCardProps) => {
  const navigate = useNavigate();
  const onPreview = () => navigate(`/articles/v2/${article._id}`);

  const renderStatus = () => {
    const baseClasses = "text-xs font-medium px-2 py-0.5 rounded";
    const statusColor = {
      approved: "bg-green-100/80 text-green-900",
      pending: "bg-yellow-100/80 text-yellow-900",
      rejected: "bg-red-100/80 text-red-900",
    }[label];

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(baseClasses, statusColor)}>{statusLabels[label]}</span>
        </TooltipTrigger>
      </Tooltip>
    );
  };

  return (
    <div
      onClick={onPreview}
      key={article._id}
      className="flex justify-between items-center px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0 overflow-hidden">
        <Box className="w-5 h-5 flex-shrink-0" style={{ color: article.product.labelColor }} />
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium text-foreground truncate">{article.title}</span>
          <span className="text-muted-foreground text-xs">{article.product.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">{renderStatus()}</div>
    </div>
  );
};

export default MyEntryCard;
