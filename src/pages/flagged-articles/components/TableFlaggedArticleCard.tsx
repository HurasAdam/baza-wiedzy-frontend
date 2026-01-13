import { Flag, List, MoreVertical, Tag, Trash } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";
import { cn } from "../../../lib/utils";
import type { FlaggedArticle } from "../../articles/components/ArticlesList";

interface TableFlaggedArticleCardProps {
  article: FlaggedArticle;
  toggleFavourite: (id: string) => void;
  onUnflag: (article: FlaggedArticle) => void;
  openFlagModal: (article: FlaggedArticle) => void;
  toggleFavouriteLoading: boolean;
}

export const TableFlaggedArticleCard = ({ article, openFlagModal, onUnflag }: TableFlaggedArticleCardProps) => {
  const location = useLocation();
  const [selectedFlag, setSelectedFlag] = useState(article.flag?._id);

  return (
    <div
      key={article._id}
      className="flex items-center justify-between px-5 py-3 text-sm
        hover:bg-muted/70 transition-colors
        first:rounded-t-xl first:border-t
        last:rounded-b-xl last:border-b
      "
      title={`Autor: ${article.createdBy.name}`}
    >
      <div className="flex items-center flex-1 min-w-0">
        {article.flag && (
          <div
            className={cn(
              "flex-shrink-0 w-5.5 h-5.5 rounded-full flex items-center justify-center",
              selectedFlag === article.flag._id ? "ring-1 ring-border" : ""
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
          <span className="font-medium text-foreground  break-after-all leading-tight">{article.title}</span>
          <span className="text-muted-foreground text-xs truncate">{article.product?.name ?? "—"}</span>
        </Link>
      </div>

      {/* Prawa sekcja: FileText + liczba wariantów + status */}
      <div className="flex items-center gap-16 pr-2 min-w-[60px] justify-end">
        {/* Ikona artykułu */}
        {article.responseVariantsCount > 1 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted/10 border border-muted/30 shadow-sm">
                <List className="w-3 h-3" />
                {article.responseVariantsCount}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-muted p-2 rounded-md text-xs" side="top">
              ilość wariantów
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="opacity-0 pointer-events-none px-2 py-1 text-xs">
            <List className="w-3 h-3" />
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="transition-colors">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52 bg-background shadow-xl border border-border rounded-lg py-1 animate-fade-in">
            {/* Sekcja 1: zmiana etykiety */}
            <DropdownMenuItem
              onClick={() => openFlagModal(article)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <Tag className="w-5 h-5 text-primary" />
              Zmień etykietę
            </DropdownMenuItem>

            {/* Separator */}
            <DropdownMenuSeparator />

            {/* Sekcja 2: akcje destrukcyjne */}
            <DropdownMenuItem
              onClick={() => onUnflag(article)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <Trash className="w-5 h-5 text-destructive" />
              Usuń z ulubionych
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
