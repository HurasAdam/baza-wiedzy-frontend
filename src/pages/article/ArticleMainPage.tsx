import {
  Archive,
  CheckCircleIcon,
  EyeIcon,
  Loader,
  RefreshCw,
  SquarePen,
  Star,
  UserIcon,
  UserRoundCheck,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useOutletContext, useParams } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { cn } from "../../lib/utils";
import type { Article } from "../../types/article";
export interface ArticleOutletContext {
  article: Article;
  refetch: () => void;
  isArticleRefreshing: boolean;
  userPermissions: {};
}
export const ArticleMainPage = () => {
  const { id } = useParams<{ id: string }>();

  const { article, refetch, isArticleRefreshing, userPermissions } = useOutletContext<ArticleOutletContext>();
  const [activeVersion, setActiveVersion] = useState(0);

  const sortedDescriptions = [...(article?.responseVariants ?? [])].sort((a, b) => a.version - b.version);
  const currentDescription = sortedDescriptions[activeVersion] ?? null;

  if (!article) {
    return <p className="text-center mt-10">Artykuł nie znaleziony</p>;
  }

  return (
    <div className="bg-background z-10 py-0 flex flex-col gap-3">
      {/* ---- Status i akcje ---- */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
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
          {article.status === "draft" && (
            <Badge className="bg-destructive/10 text-rose-800/95 border border-destructive/30 flex items-center whitespace-nowrap">
              <XCircleIcon className="w-4 h-4 mr-1" /> Wymaga zatwierdzenia
            </Badge>
          )}
          {article.status === "rejected" && (
            <Badge className="bg-destructive/10 text-rose-800/95 border border-destructive/30 flex items-center whitespace-nowrap">
              <XCircleIcon className="w-4 h-4 mr-1" /> Odrzucony
            </Badge>
          )}
          <Badge variant="secondary" className="flex items-center whitespace-nowrap">
            <EyeIcon className="w-4 h-4 mr-1" /> {article.viewsCounter} wyświetleń
          </Badge>
        </div>

        <TooltipProvider>
          <div className="flex gap-2 items-center">
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={refetch} variant="ghost" className="transition" size="icon">
                    {isArticleRefreshing ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-muted">Odśwież</TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Star className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-muted">Dodaj do ulubionych</TooltipContent>
            </Tooltip>

            {userPermissions.includes("EDIT_ARTICLE") && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink to={`/articles/${id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <SquarePen className="w-4 h-4" />
                    </Button>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent className="bg-muted">Edytuj</TooltipContent>
              </Tooltip>
            )}

            {userPermissions.includes("ARCHIVE_ARTICLE") && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Archive className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-muted">Archiwizuj</TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      </div>

      {/* ---- Product/Category/Tag Badges ---- */}
      <div className="flex justify-between mt-2 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="whitespace-nowrap">
            Produkt: {article.product.name}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            Kategoria: {article.category.name}
          </Badge>
          {article.tags.map((tag) => (
            <Badge key={tag._id} variant="outline" className="whitespace-nowrap">
              # {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* ---- Główna treść i panel wersji ---- */}
      <div className="relative flex gap-6">
        {/* Główna treść */}
        <div className="flex-1">
          <Card className="">
            <CardContent className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-1 text-header-foreground">Uwagi dla pracownika</h3>
                <p className="text-base text-foreground">{article.employeeDescription}</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-1 text-header-foreground">Odpowiedź dla klienta</h3>
                <p className="whitespace-pre-wrap break-all text-foreground">{currentDescription?.variantContent}</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-1 text-header-foreground">Autor artykułu</h3>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon className="w-5 h-5" /> {article.createdBy.name} {article.createdBy.surname}
                </p>
              </section>

              {article.verifiedBy && (
                <section>
                  <h3 className="text-lg font-semibold mb-1 text-header-foreground">Zweryfikowany przez</h3>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserRoundCheck className="w-5 h-5" /> {article.verifiedBy.name} {article.verifiedBy.surname}
                  </p>
                </section>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="sticky top-20 w-60 h-fit bg-card shadow-lg rounded-xl p-4 flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Wersje artykułu</h4>

          {sortedDescriptions.map((desc, index) => (
            <button
              key={desc._id}
              onClick={() => setActiveVersion(index)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200 border border-transparent",
                activeVersion === index
                  ? "bg-primary text-primary-foreground shadow-md border-primary"
                  : "bg-muted hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <div className="flex flex-col text-left truncate">
                <span className="text-sm font-medium truncate">
                  {desc.variantName?.trim() || `Wersja ${desc.version}`}
                </span>
                <span className="text-xs text-muted-foreground truncate">{desc.description?.substring(0, 40)}</span>
              </div>
              <div className="flex items-center ml-2">
                {desc.status === "approved" && <CheckCircleIcon className="w-4 h-4 text-emerald-500" />}
                {desc.status === "pending" && <XCircleIcon className="w-4 h-4 text-yellow-500" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
