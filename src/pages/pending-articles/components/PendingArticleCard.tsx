import { AlertTriangle, CheckCircle2, Clock, DiamondPlus, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../../../components/Dropdown";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import type { ArticleListItem } from "../../../types/article";

const statusIcons: Record<string, JSX.Element> = {
  draft: <DiamondPlus className="w-5 h-5 text-muted-foreground" />,
  pending: <Clock className="w-4 h-4 text-yellow-500" />,
  rejected: <AlertTriangle className="w-4 h-4 text-red-500" />,
  approved: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "draft":
      return "Nowy";
    case "pending":
      return "Oczekujący";
    case "rejected":
      return "Odrzucony";
    case "approved":
      return "Zatwierdzony";
    default:
      return status;
  }
};

const PendingArticleCard = ({
  userPermissions,
  article,
  onApprove,
  onReject,
  loading,
}: {
  userPermissions: string[];
  article: ArticleListItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}) => {
  const navigate = useNavigate();

  const onPreview = () => navigate(`/articles/${article._id}`);
  const createdAt = new Date(article.createdAt).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const dropdownOptions = [
    userPermissions.includes("APPROVE_ARTICLE") && {
      label: "Zatwierdź",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      actionHandler: () => onApprove(article._id),
    },
    userPermissions.includes("REJECT_ARTICLE") && {
      label: "Zgłoś uwagi",
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      actionHandler: () => onReject(article._id),
    },
  ].filter(Boolean);

  return (
    <li className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition">
      {/* Left side: status + title */}
      <div className="flex items-center gap-3 min-w-0">
        {statusIcons[article.status]}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold truncate">{article.title}</span>
          <span className="text-xs text-muted-foreground truncate">
            {article.createdBy?.name} {article.createdBy?.surname} • {createdAt}
          </span>
        </div>
      </div>

      {/* Right side: product label + akcje */}
      <div className="flex items-center gap-4">
        {article.product && (
          <Badge variant="outline" className="text-xs mr-4">
            {article.product.name}
          </Badge>
        )}

        {/* Akcje */}
        <div className="flex items-center gap-2">
          <Button onClick={onPreview} size="sm" variant="outline" className="hover:bg-primary/10">
            Wyświetl
          </Button>

          {/* Dropdown tylko jeśli status nie jest "rejected" */}
          {article.status !== "rejected" && dropdownOptions.length > 0 && (
            <Dropdown
              triggerBtn={
                <Button size="icon" variant="ghost" aria-label="Więcej opcji">
                  <MoreHorizontal className="w-5 h-5 hover:text-primary" />
                </Button>
              }
              options={dropdownOptions}
              position={{ align: "end" }}
            />
          )}
        </div>
      </div>
    </li>
  );
};

export default PendingArticleCard;
