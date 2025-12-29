import { Box, Calendar, CheckCircleIcon, Loader, Tag, Users, XCircleIcon } from "lucide-react";
import type { JSX } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import type { Article } from "../../../../types/article";

interface Props {
  article: Article;
}

export const ArticleMetadata = ({ article }: Props) => {
  const statusMap: Record<string, { label: string; className: string; icon: JSX.Element }> = {
    draft: {
      label: "Nowy – oczekuje weryfikacji",
      className: " text-cyan-600/85 border border-yellow-300 bg-transparent",
      icon: <XCircleIcon className="w-4 h-4" />,
    },
    pending: {
      label: "Wymaga weryfikacji",
      className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      icon: <Loader className="w-4 h-4 animate-spin" />,
    },
    approved: {
      label: "Zweryfikowany",
      className: "text-emerald-600/95 bg-transparent font-medium",
      icon: <CheckCircleIcon className="w-4 h-4 text-green-600/85 " />,
    },
    rejected: {
      label: "Odrzucony",
      className: "bg-destructive/10 text-rose-800/95 border border-destructive/30",
      icon: <XCircleIcon className="w-4 h-4" />,
    },
  };

  return (
    <Card className="shadow-sm border bg-card/70">
      <CardContent className="flex flex-col gap-6">
        {[
          {
            label: "Status",
            icon: statusMap[article.status]?.icon ?? <Loader className="w-4 h-4 text-muted-foreground" />,
            value: (
              <Badge
                className={`flex items-center whitespace-nowrap bg-transparent break-words border-none tems-center max-w-full ${
                  statusMap[article.status].className
                }`}
              >
                {statusMap[article.status].label}
              </Badge>
            ),
          },
          {
            label: "Produkt",
            icon: <Box className="w-4 h-4" style={{ color: article.product.labelColor }} />,
            value: article.product.name,
          },
          { label: "Kategoria", icon: <Tag className="w-4 h-4 text-purple-500" />, value: article.category.name },
          {
            label: "Autor",
            icon: <Users className="w-4 h-4 text-gray-500" />,
            value: `${article.createdBy.name} ${article.createdBy.surname}`,
          },
          {
            label: "Data dodania",
            icon: <Calendar className="w-4 h-4 text-gray-500" />,
            value: new Date(article.createdAt).toLocaleString("pl-PL"),
          },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3.5">
            <div className="border p-2.5 bg-background rounded-md">{item.icon}</div>
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{item.label}</h3>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          </div>
        ))}
        {article.tags?.length > 0 && (
          <div className="pt-3 border-t border-border">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Tagi</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag._id} variant="secondary" className="rounded-md px-2.5 py-1 text-xs bg-muted/60">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
