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
  rejectedBy: string | null;
  createdBy: Author;
  viewsCounter: number;
  isTrashed: boolean;
  product: Product;
  category: Category;
  createdAt: string; // ISO date string
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
  label: string;
}

const MyEntryCard = ({ article, label }: MyEntryCardProps) => {
  return (
    <div
      key={article._id}
      className="flex justify-between items-center px-4 py-3 text-sm hover:bg-muted transition-colors cursor-pointer"
      title={`Autor: ${article.createdBy.name}`}
    >
      <div className="flex flex-col overflow-hidden">
        <span className="font-medium text-foreground truncate">
          {article.title}
        </span>
        <span className="text-muted-foreground text-xs">
          {article.product.name}
        </span>
      </div>

      <span
        className={cn(
          "text-xs font-medium px-2 py-0.5 rounded",
          label === "approved"
            ? "bg-green-200/75 text-teal-900"
            : label === "pending"
            ? "bg-amber-200/75 text-amber-900"
            : "bg-rose-200/75 text-rose-900"
        )}
      >
        {statusLabels[label]}
      </span>
    </div>
  );
};

export default MyEntryCard;
