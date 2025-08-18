import {
  ArrowLeft,
  CheckCircleIcon,
  DownloadIcon,
  EyeIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  SquarePen,
  Star,
  Trash2,
  UserIcon,
  UserRoundCheck,
  XCircleIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PendingArticleRejectionModal } from "../../components/pending-articles/pending-article-rejection-modal";
import { Alert } from "../../components/shared/alert-modal";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import queryClient from "../../config/query.client";
import {
  useAproveArticleMutation,
  useFindArticleQuery,
  useRejectArticleMutation,
} from "../../hooks/articles/use-articles";
import { cn } from "../../lib/utils";
import { generateMockHistory, getEventConfig } from "../../utils/article-event";
import { EditArticlePage } from "../edit-article/EditArticlePage";
import { ArticleVerificationBanner } from "./components/ArticleVerificationBanner";
import { RejectedArticleBanner } from "./components/RejectedArticleBanner";
import { ArticlePageSkeleton } from "./skeleton/ArticlePageSkeleton";

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileIcon className="w-12 h-12 text-rose-800/80" />;
    case "obraz":
      return <FileImageIcon className="w-12 h-12 text-blue-800/80" />;
    case "dokument word":
    case "docx":
    case "text":
      return <FileTextIcon className="w-12 h-12 text-green-800/80" />;
    default:
      return <FileTextIcon className="w-12 h-12 text-gray-600" />;
  }
};

export const ArticlePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("main");
  const [activeVersion, setActiveVersion] = useState(0);
  const { data: article, isLoading, isError, error } = useFindArticleQuery(id);
  const mockHistory = useMemo(() => generateMockHistory(20), []);

  const [isCreatinArticleApprove, setIsCreatingArticleApprove] = useState<boolean>(false);
  const [isCreatingArticleRejection, setIsCreatingArticleRejection] = useState<boolean>(false);

  const { mutate: approveMutate, isPending: isApproveLoading } = useAproveArticleMutation();
  const { mutate: rejectionMutate } = useRejectArticleMutation();

  const onEditCancel = () => {
    setActiveTab("main");
  };

  const onArticleAproveConfirm = () => {
    if (!article) return;
    approveMutate(article._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["article", article._id] });
        toast.success("Artykuł został zatwierdzony.");
      },
      onSettled: () => {
        setIsCreatingArticleApprove(false);
      },
    });
  };

  const onArticleRejectConfirm = ({ rejectionReason }: { rejectionReason: string }) => {
    if (article) {
      rejectionMutate(
        { articleId: article._id, rejectionReason },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            toast.success("Artykuł został odrzucony, uwagi zostały wysłane do autora artykułu");
          },
          onSettled: () => {
            setIsCreatingArticleRejection(false);
          },
        }
      );
    }

    setIsCreatingArticleRejection(false);
  };

  const onArticleAprove = () => {
    setIsCreatingArticleApprove(true);
  };

  const onArticleReject = () => {
    setIsCreatingArticleRejection(true);
  };

  const onCloseArticleApproveAlert = () => {
    setIsCreatingArticleApprove(false);
  };

  if (isLoading) return <ArticlePageSkeleton />;

  if (isError) {
    return (
      <p className="text-destructive text-center mt-10">
        {(error as Error)?.message || "Błąd podczas ładowania artykułu"}
      </p>
    );
  }

  if (!article) {
    return <p className="text-center mt-10">Artykuł nie znaleziony</p>;
  }

  const sortedDescriptions = [...article.responseVariants].sort((a, b) => a.version - b.version);

  const currentDescription = sortedDescriptions[activeVersion];

  return (
    <div className="mx-auto pb-6">
      {activeTab !== "edit" && article.status === "rejected" && (
        <RejectedArticleBanner article={article} isResubmitting={isApproveLoading} onResubmit={onArticleAprove} />
      )}

      {["pending", "draft"].includes(article.status) && activeTab !== "edit" && (
        <ArticleVerificationBanner status={article.status} onApprove={onArticleAprove} onReject={onArticleReject} />
      )}

      {activeTab !== "edit" && (
        <div className="bg-background z-10  py-0  px-4  flex flex-col gap-3">
          {/* ---- Title -----*/}
          <div className="pt-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-2  rounded-md transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Powrót
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-foreground truncate">{article.title}</h1>

          {/* ---- Status ----*/}
          <div className="flex justify-between items-center flex-wrap gap-3 ">
            {/* Status weryfikacji */}
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
            {/* ---- Edit mode action buttons ----- */}
            {activeTab === "edit" && (
              <div className="flex gap-2 flex-wrap justify-end flex-grow max-w-full">
                <Button onClick={() => setActiveTab("main")} size="sm" variant="destructive">
                  Anuluj
                </Button>
              </div>
            )}{" "}
            {/* --------- Main action buttons ------ */}
            {activeTab !== "edit" && (
              <TooltipProvider>
                <div className="flex gap-2 items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" onClick={() => setActiveTab("edit")}>
                        <Star className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Dodaj do ulubionych</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" onClick={() => setActiveTab("edit")}>
                        <SquarePen className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edytuj</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Usuń</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            )}
          </div>

          {/* ---- Product/Category/Tag Badges ----- */}
          <div className="flex justify-between mt-2 mb-4 ">
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

            {activeTab !== "edit" && (
              <div className="flex bg-muted rounded-xl px-2 py-1 gap-1">
                <button
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    activeTab === "main"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("main")}
                >
                  Dane główne
                </button>
                <button
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    activeTab === "attachments"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("attachments")}
                >
                  Załączniki
                </button>
                <button
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    activeTab === "history"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  Historia zmian
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {activeTab !== "edit" && (
          <div className="flex bg-muted rounded-xl px-2 py-1 gap-1">
            {sortedDescriptions.map((desc, index) => {
              console.log("DESC", desc);
              return (
                <button
                  key={desc.version}
                  onClick={() => setActiveVersion(index)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-colors min-w-32 max-w-30 truncate  overflow-hidden",
                    activeVersion === index
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {}
                  {desc.variantName?.trim() ? desc.variantName : `Wersja ${desc.version}`}
                </button>
              );
            })}
          </div>
        )}
        <TabsContent value="main">
          <Card className="mt-6">
            <CardContent className="space-y-6 p-6">
              <section>
                <h3 className="text-lg font-semibold mb-1">Opis pracownika</h3>
                <p className="text-base text-foreground">{article.employeeDescription}</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-1">Opis klienta</h3>
                <p className="whitespace-pre-wrap text-foreground break-words">{currentDescription?.variantContent}</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-1">Autor artykułu</h3>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon className="w-5 h-5" /> {article.createdBy.name} {article.createdBy.surname}
                </p>
              </section>

              {article.verifiedBy && (
                <section>
                  <h3 className="text-lg font-semibold mb-1">Zweryfikowany przez</h3>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserRoundCheck className="w-5 h-5" /> {article.verifiedBy.name} {article.verifiedBy.surname}
                  </p>
                </section>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments">
          <Card className="mt-6">
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {[].map((file) => (
                <div
                  key={file._id}
                  className="border rounded-xl p-4 flex flex-col items-center text-center bg-muted/50 hover:bg-muted transition-colors"
                >
                  {getFileIcon(file.type)}
                  <p className="text-sm font-medium mt-2 line-clamp-2">{file.name}</p>
                  <Button
                    className="mt-3 w-full"
                    size="sm"
                    variant="secondary"
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    <DownloadIcon className="w-4 h-4 mr-1" /> Pobierz
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="mt-6 bg-transparent shadow-none pr-4">
            <CardContent className="p-0">
              <ul className="relative border-l-2 border-border">
                {mockHistory.map((item) => {
                  const { Icon, bgClass } = getEventConfig(item.type);

                  return (
                    <li key={item.id} className="mb-3 ml-8">
                      {/* Ikona na osi czasu */}
                      <span
                        className={`
                  absolute -left-4 flex items-center justify-center
                  w-8 h-8 ${bgClass} rounded-full
                  ring-4 ring-background shadow-lg
                `}
                      >
                        <Icon className="w-4 h-4 text-primary-foreground" />
                      </span>

                      {/* Karta */}
                      <div className="relative bg-card p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-1">
                          {/* Event action + user */}
                          <div className="flex flex-col">
                            {/* Akcja (np. "Edycja artykułu") */}
                            <div className="flex items-center space-x-1 text-sm font-medium text-foreground">
                              <Icon className="w-4 h-4" />
                              <span>{item.action}</span>
                            </div>
                            {/* Nazwisko niżej, mniejsze */}
                            <span className="mt-1 text-xs text-muted-foreground">{item.user}</span>
                          </div>

                          {/* Data i szczegóły */}
                          <div className="flex items-center space-x-2">
                            <time className="text-xs text-muted-foreground">{item.date}</time>
                            <Link
                              to={`/articles/${article._id}/history/${item.id}`}
                              className="text-primary text-sm hover:text-primary/80"
                              aria-label="Zobacz szczegóły"
                            >
                              →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <EditArticlePage articleId={article._id} onEditCancel={onEditCancel} />
        </TabsContent>
      </Tabs>
      <Alert
        isOpen={isCreatinArticleApprove}
        isLoading={isApproveLoading}
        type="info"
        title="Zatwierdź artykuł"
        onCancel={onCloseArticleApproveAlert}
        onConfirm={onArticleAproveConfirm}
      >
        Czy na pewno chcesz zatwierdzić ten artykuł?
      </Alert>

      <PendingArticleRejectionModal
        onSubmit={onArticleRejectConfirm}
        isCreatingArticleRejection={isCreatingArticleRejection}
        setIsCreatingArticleRejection={setIsCreatingArticleRejection}
      />
    </div>
  );
};
