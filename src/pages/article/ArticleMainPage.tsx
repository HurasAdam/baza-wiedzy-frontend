import {
  Archive,
  Bell,
  BellOff,
  CheckCircleIcon,
  Copy,
  EyeIcon,
  Heart,
  Info,
  Loader,
  MoreVertical,
  RefreshCw,
  SquarePen,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useOutletContext, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArticleExtraInfoModal } from "../../components/article/article-extra-info.modal";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Separator } from "../../components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import queryClient from "../../config/query.client";
import {
  useArticleToggleFavouriteMutation,
  useFollowArticleMutation,
  useUnfollowArticleMutation,
} from "../../hooks/articles/use-articles";
import type { Article } from "../../types/article";

export interface ArticleOutletContext {
  article: Article;
  refetch: () => Promise<void>;
  isArticleRefreshing: boolean;
  userPermissions: {};
}

export const ArticleMainPage = () => {
  const { id } = useParams<{ id: string }>();
  const { article, refetch, isArticleRefreshing, userPermissions } = useOutletContext<ArticleOutletContext>();
  const { mutate: followArticleMutate } = useFollowArticleMutation();
  const { mutate: unfollowArticleMutate } = useUnfollowArticleMutation();
  const { mutate: toggleArticleFavouriteMutate, isPending: isFavouriteTogglePending } =
    useArticleToggleFavouriteMutation();
  const [isExtraInforModalOpen, setIsExtraInfoModalOpen] = useState(false);

  if (!article) {
    return <p className="text-center mt-10">Artykuł nie znaleziony</p>;
  }

  const openExtraInfoModal = () => {
    setIsExtraInfoModalOpen(true);
  };

  const handleFollowToggle = (articleId: string, isFollowed: boolean) => {
    if (isFollowed) {
      unfollowArticleMutate(articleId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["article", articleId] });
          toast.success("Artykuł został usunięty z listy obserwowanych", {
            position: "bottom-right",
          });
        },
      });
    } else {
      followArticleMutate(articleId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["article", articleId] });
          toast.success("Artykuł został dodany do listy obserwowanych", {
            position: "bottom-right",
          });
        },
      });
    }
  };

  const onRefresh = async () => {
    try {
      const result = await refetch(); // czeka aż zakończy się odświeżanie
      if (!result.error) {
        toast.success("Odświeżono.", {
          description: "Dane artykułu zostały zaktualizowane.",
          position: "bottom-right",
        });
      } else {
        toast.error("Nie udało się odświeżyć danych", { position: "bottom-right" });
      }
    } catch {
      toast.error("Błąd podczas odświeżania danych", { position: "bottom-right" });
    }
  };

  const handleFavouriteToggle = (articleId: string) => {
    toggleArticleFavouriteMutate(articleId, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["article", article._id] });
        toast.success("Zaktualizowano", {
          description: data?.message || "Zaktualizowano ulubione",
          position: "bottom-right",
        });
      },
    });
  };

  const sortedDescriptions = [...(article?.responseVariants ?? [])].sort((a, b) => a.version - b.version);

  // helper
  const copyToClipboardWithToast = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Odpowiedź została skopiowana do schowka", {
      position: "bottom-right",
    });
  };

  return (
    <div className="bg-background z-10 py-0 flex flex-col gap-3 pb-9">
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
          <TooltipProvider>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleFavouriteToggle(article._id)}
                    size="icon"
                    variant={article.isFavourite ? "ghost" : "ghost"}
                    className={`transition relative ${
                      article.isFavourite ? " border-primary/30 hover:bg-primary/20" : "hover:bg-accent"
                    }`}
                    disabled={isFavouriteTogglePending} // blokuje przycisk podczas mutacji
                  >
                    {isFavouriteTogglePending ? (
                      <Loader className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <Heart
                        className={`w-4 h-4 transition ${
                          article.isFavourite ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-muted text-sm">
                  {article.isFavourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                </TooltipContent>
              </Tooltip>
            </div>

            {/* <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={onRefresh} variant="ghost" className="transition hover:bg-primary/20" size="icon">
                    {isArticleRefreshing ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-muted">Odśwież</TooltipContent>
              </Tooltip>
            </div> */}
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-5  pr-2.5">
          <TooltipProvider>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={openExtraInfoModal}
                    variant="ghost"
                    className="transition hover:bg-primary/20"
                    size="icon"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-muted">Info</TooltipContent>
              </Tooltip>
            </div>
            {/* <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleFavouriteToggle(article._id)}
                    size="icon"
                    variant={article.isFavourite ? "default" : "outline"}
                    className={`transition relative ${
                      article.isFavourite ? "bg-primary/10 border-primary/30 hover:bg-primary/20" : "hover:bg-accent"
                    }`}
                    disabled={isFavouriteTogglePending} // blokuje przycisk podczas mutacji
                  >
                    {isFavouriteTogglePending ? (
                      <Loader className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <Star
                        className={`w-4 h-4 transition ${
                          article.isFavourite ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-muted text-sm">
                  {article.isFavourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                </TooltipContent>
              </Tooltip>
            </div> */}
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {/* Obserwuj / Przestań obserwować */}
              <DropdownMenuItem onClick={() => handleFollowToggle(article._id, article.isFollowed)}>
                {article.isFollowed ? <BellOff className="mr-1.5" /> : <Bell className="mr-1.5" />}
                {article.isFollowed ? "Przestań obserwować" : "Obserwuj"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openExtraInfoModal}>
                <Info className="w-4 h-4 mr-1.5" /> Informacje
              </DropdownMenuItem>

              {userPermissions.includes("EDIT_ARTICLE") && (
                <DropdownMenuItem asChild>
                  <NavLink to={`/articles/${id}/edit`}>
                    <div className="flex items-center gap-2">
                      <SquarePen className="w-4 h-4 mr-1.5" /> Edytuj
                    </div>
                  </NavLink>
                </DropdownMenuItem>
              )}

              {userPermissions.includes("ARCHIVE_ARTICLE") && (
                <DropdownMenuItem onClick={() => console.log("Archiwizuj")}>
                  <Archive className="w-4 h-4 mr-2" /> Archiwizuj
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={refetch}>
                <RefreshCw className="w-4 h-4 mr-1.5" /> Odśwież
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
      {article.employeeDescription && (
        <Card>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold">{`Instrukcja dla pracownika`}</h3>
            </div>
            <Separator />
            <p className="text-sm whitespace-pre-wrap mt-3">{article.employeeDescription}</p>
          </CardContent>
        </Card>
      )}

      {/* ---- Główna treść ---- */}
      <div className={`grid gap-4 ${sortedDescriptions.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
        {sortedDescriptions.map((desc) => (
          <Card key={desc._id}>
            <CardContent>
              <div className="flex justify-between items-center mb-2  ">
                <h3 className="text-sm font-semibold">
                  <span className="text-xs">Odpowiedź</span> {desc.variantName?.trim() || `Wersja ${desc.version}`}
                </h3>
                {desc.variantContent && (
                  <Copy
                    onClick={() => copyToClipboardWithToast(desc.variantContent)}
                    className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary"
                  />
                )}
              </div>
              <Separator></Separator>
              <p className="text-sm whitespace-pre-wrap text-foreground mt-3">{desc.variantContent}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ArticleExtraInfoModal isOpen={isExtraInforModalOpen} article={article} setIsOpen={setIsExtraInfoModalOpen} />
    </div>
  );
};
