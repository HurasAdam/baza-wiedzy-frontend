import { FileText, Flag } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";
import { cn } from "../../../lib/utils";
import type { Article } from "../../../types/article";

interface TableFlaggedArticleCardProps {
  article: Article & { flag?: { id: string; name: string; color: string } };
  onFlagChange: (articleId: string, flagId: string) => void;
  toggleFavourite: (id: string) => void;
  toggleFavouriteLoading: boolean;
}

export const TableFlaggedArticleCard = ({
  article,
  onFlagChange,
  toggleFavourite,
  toggleFavouriteLoading,
}: TableFlaggedArticleCardProps) => {
  const location = useLocation();
  const [selectedFlag, setSelectedFlag] = useState(article.flag?.id);

  const handleFlagSelect = (flagId: string) => {
    setSelectedFlag(flagId);
    onFlagChange(article._id, flagId);
  };

  return (
    <div
      key={article._id}
      className="flex items-center justify-between px-5 py-3 text-sm hover:bg-muted/70 transition-colors rounded-lg"
      title={`Autor: ${article.createdBy.name}`}
    >
      {/* Lewa sekcja: flaga + tytuł + produkt */}
      <div className="flex items-center flex-1 min-w-0">
        {article.flag && (
          <div
            className={cn(
              "flex-shrink-0 w-5.5 h-5.5 rounded-full flex items-center justify-center",
              selectedFlag === article.flag.id ? "ring-1 ring-border" : ""
            )}
            style={{ backgroundColor: article.flag.color }}
            title={article.flag.name}
          >
            <Flag className="w-3 h-3 text-white" />
          </div>
        )}

        <Link
          to={`/articles/${article._id}`}
          state={{ from: location.pathname + location.search }}
          className="flex flex-col overflow-hidden flex-grow ml-3"
        >
          <span className="font-medium text-foreground truncate leading-tight">{article.title}</span>
          <span className="text-muted-foreground text-xs truncate">{article.product?.name ?? "—"}</span>
        </Link>
      </div>

      {/* Prawa sekcja: FileText + liczba wariantów + status */}
      <div className="flex items-center gap-3 pr-2 min-w-[60px] justify-end">
        {/* Ikona artykułu */}
        <div className="relative flex-shrink-0">
          <FileText className="w-5 h-5 text-muted-foreground" />
          {article.responseVariantsCount > 1 && (
            <span className="absolute -top-1 -right-1.5 flex items-center justify-center w-4 h-4 text-[9px] font-medium text-white bg-primary/90 shadow-sm rounded-full">
              {article.responseVariantsCount}
            </span>
          )}
        </div>

        {/* Status — z rezerwacją miejsca */}
        <div className="flex items-center justify-center w-6 h-6">
          {article.status === "pending" ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-6 h-6 cursor-default">
                  <svg
                    className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 4a1 1 0 011 1v3a1 1 0 11-2 0V7a1 1 0 011-1zm0 6a1 1 0 110 2 1 1 0 010-2z" />
                  </svg>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-muted" side="top">
                Wymaga weryfikacji
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="w-6 h-6" /> // rezerwacja miejsca
          )}
        </div>
      </div>
    </div>
  );
};
