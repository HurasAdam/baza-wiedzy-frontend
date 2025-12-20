import {
  Archive,
  Bell,
  BellOff,
  Copy,
  Flag,
  Heart,
  Info,
  Loader,
  MoreVertical,
  Plus,
  RefreshCw,
  SquarePen,
  Star,
  StarOff,
  Tag,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useOutletContext, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArticleExtraInfoModal } from "../../components/article/article-extra-info.modal";
import { FlagModal, type FlagForm } from "../../components/flag/flag-modal";
import { MarkWithFlagArticleModal } from "../../components/flag/mark-with-flag-article-modal";
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
  useCreateArticleUserFlagMutation,
  useFindOneArticleUserFlagQuery,
  useUnflagArticleUserFlagMutation,
} from "../../hooks/article-user-flag/use-article-user-flag";
import {
  useArticleToggleFavouriteMutation,
  useFollowArticleMutation,
  useMarkAsImportantMutation,
  useUnfollowArticleMutation,
  useUnmarkAsImportantMutation,
} from "../../hooks/articles/use-articles";
import { useCreateFlagMutation } from "../../hooks/flag/user-flag";
import type { Article } from "../../types/article";

export interface ArticleOutletContext {
  article: Article;
  refetch: () => Promise<void>;
  isArticleRefreshing: boolean;
  userPermissions: {};
}

const dummyFlags = [
  { _id: "1", name: "Czerwony", color: "#FF4C4C" },
  { _id: "2", name: "Niebieski", color: "#4C6FFF" },
  { _id: "3", name: "Zielony", color: "#4CFF6F" },
  { _id: "4", name: "Żółty", color: "#FFE14C" },
  { _id: "5", name: "Fioletowy", color: "#A14CFF" },
  { _id: "6", name: "Pomarańczowy", color: "#FF944C" },
];

export const ArticleMainPage = () => {
  const { id } = useParams<{ id: string }>();
  const { article, refetch, isArticleRefreshing, userPermissions } = useOutletContext<ArticleOutletContext>();
  const { data: articleUserFlag } = useFindOneArticleUserFlagQuery(id || null);

  const { mutate: followArticleMutate, isPending: isFollowPending } = useFollowArticleMutation();
  const { mutate: unfollowArticleMutate, isPending: isUnfollowPending } = useUnfollowArticleMutation();
  const { mutate: toggleArticleFavouriteMutate, isPending: isFavouriteTogglePending } =
    useArticleToggleFavouriteMutation();
  const { mutate: createFlagMutate, isPending: isCreateFlagPending } = useCreateFlagMutation();
  const { mutate: flagArticleMutate, isPending: isFlagingArticlePending } = useCreateArticleUserFlagMutation();
  const { mutate: unflagMutate } = useUnflagArticleUserFlagMutation();
  const { mutate: markAsImportantMutate } = useMarkAsImportantMutation();
  const { mutate: unmarkAsImportantMutate } = useUnmarkAsImportantMutation();

  const [isExtraInforModalOpen, setIsExtraInfoModalOpen] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isCreateFlagModalOpen, setIsCreateFlagModalOpen] = useState(false);

  if (!article) {
    return <p className="text-center mt-10">Artykuł nie znaleziony</p>;
  }

  const openExtraInfoModal = () => {
    setIsExtraInfoModalOpen(true);
  };

  const openCreateFlagModal = (): void => {
    setIsFlagModalOpen(true);
  };
  const onCreateFlag = (data: FlagForm) => {
    createFlagMutate(data, {
      onSuccess: () => {
        toast.success("Zapisano zmian", {
          position: "bottom-right",
          description: "Dodano nową flagę",
        });
        setIsCreateFlagModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["my-flags"] });
      },
    });
  };

  const onFlagArticle = (payload) => {
    flagArticleMutate(payload, {
      onSuccess: () => {
        toast.success("Zmiany zostały zapisane", {
          position: "bottom-right",
          description: "Artykuł został oznaczny flagą",
        });
        setIsFlagModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["article-user-flag", article._id] });
      },
    });
  };

  const onUnflag = (articleId: string): void => {
    if (!article) return;
    unflagMutate(articleId, {
      onSuccess: () => {
        toast.success("Oznaczenie artykułu zostało usunięte", {
          position: "bottom-right",
          description: "Artykuł nie jest już oznaczony flagą.",
          duration: 4000,
        });
        queryClient.invalidateQueries({ queryKey: ["article-user-flag", article._id] });
      },
    });
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

  const handleMarkAsImportant = (articleId: string) => {
    markAsImportantMutate(articleId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["article", articleId] });
        toast.success("Artykuł oznaczono jako ważny", {
          position: "bottom-right",
        });
      },
    });
  };

  const handleUnmarkAsImportant = (articleId: string) => {
    unmarkAsImportantMutate(articleId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["article", articleId] });
        toast.success("Oznaczenie ważności zostało usunięte", {
          position: "bottom-right",
        });
      },
    });
  };

  const onRefresh = async () => {
    try {
      const result = await refetch();
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

  const copyToClipboardWithToast = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Odpowiedź została skopiowana do schowka", {
      position: "bottom-right",
    });
  };

  return (
    <div className="bg-background z-10 py-0 flex flex-col gap-3 pb-9 pt-6">
      {/* ---- Status i akcje ---- */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        {/* ---- Product/Category/Tag Badges ---- */}
        <div className="flex justify-between mt-2 ">
          <div className="flex flex-wrap items-center gap-2 ">
            {article.tags.map((tag) => (
              <Badge key={tag._id} variant="outline" className="whitespace-nowrap  text-muted-foreground">
                # {tag.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <div className="flex items-center space-x-2">
                {/* FOLLOW */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleFollowToggle(article._id, article.isFollowed)}
                      size="icon"
                      variant="ghost"
                      className={`relative rounded-full transition-all duration-200 ease-in-out hover:scale-105 hover:bg-primary/10 focus:outline-none ${
                        article.isFollowed ? "bg-primary/10" : "bg-transparent"
                      }`}
                      disabled={isFollowPending || isUnfollowPending}
                    >
                      {isFollowPending || isUnfollowPending ? (
                        <Loader className="w-5 h-5 animate-spin text-primary" />
                      ) : article.isFollowed ? (
                        <span className="relative">
                          <Bell className="w-5 h-5 text-primary" />
                          <BellOff className="absolute w-5 h-5 text-primary opacity-0 hover:opacity-100 transition-opacity" />
                        </span>
                      ) : (
                        <Bell className="w-5 h-5 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-muted text-sm shadow-md px-2 py-1 rounded-md">
                    {article.isFollowed ? "Przestań obserwować" : "Obserwuj"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full transition-all duration-200 ease-in-out hover:scale-105 hover:bg-primary/10 focus:outline-none  "
                    >
                      {articleUserFlag?.selectedFlag ? (
                        <Flag className="w-4 h-4" style={{ color: articleUserFlag.selectedFlag.color }} />
                      ) : (
                        <Flag className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-48 py-1">
                    {/* Grupa głównych akcji */}
                    {!articleUserFlag?.selectedFlag && (
                      <DropdownMenuItem className="py-2" onClick={openCreateFlagModal}>
                        <Heart className="w-4 h-4 mr-2 text-muted-foreground" />
                        Dodaj do ulubionych
                      </DropdownMenuItem>
                    )}

                    {articleUserFlag?.selectedFlag && (
                      <DropdownMenuItem className="py-2" onClick={() => onUnflag(article._id)}>
                        <X className="w-4 h-4 mr-2 text-muted-foreground " />
                        Usuń z ulubionych
                      </DropdownMenuItem>
                    )}

                    <Separator />

                    {/* Grupa dodatkowa: Dodaj flagę */}
                    <DropdownMenuItem onClick={() => setIsCreateFlagModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2 text-muted-foreground" />
                      Dodaj etykietę
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TooltipProvider>

            <TooltipProvider>
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={openExtraInfoModal}
                      size="icon"
                      variant="ghost"
                      className="relative rounded-full transition-all duration-200 ease-in-out hover:scale-105 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    >
                      <Info className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-muted text-sm shadow-md px-2 py-1 rounded-md">Info</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>

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
              {article.isImportant ? (
                <DropdownMenuItem onClick={() => handleUnmarkAsImportant(article._id)}>
                  <StarOff className="w-4 h-4 mr-2 text-destructive" />
                  Usuń priorytet
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleMarkAsImportant(article._id)}>
                  <Star className="w-4 h-4 mr-2 text-primary" />
                  Oznacz jako priorytetowy
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {article.employeeDescription && (
        <Card className="rounded-xl p-6 shadow-md border-l-6  border-l-primary">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Instrukcja dla pracownika</h3>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{article.employeeDescription}</p>
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
              <p className="text-sm whitespace-pre-wrap break-words text-foreground/90 mt-3 text-[15.5px] ">
                {desc.variantContent}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ArticleExtraInfoModal isOpen={isExtraInforModalOpen} article={article} setIsOpen={setIsExtraInfoModalOpen} />

      <MarkWithFlagArticleModal
        key={article._id + (article.selectedFlag?._id || "no-flag")}
        article={article}
        articleUserFlag={articleUserFlag}
        onSave={onFlagArticle}
        isOpen={isFlagModalOpen}
        setIsOpen={setIsFlagModalOpen}
        isLoading={isFlagingArticlePending}
      />
      <FlagModal
        isLoading={isCreateFlagPending}
        onSave={onCreateFlag}
        isOpen={isCreateFlagModalOpen}
        setIsOpen={setIsCreateFlagModalOpen}
      />
    </div>
  );
};
