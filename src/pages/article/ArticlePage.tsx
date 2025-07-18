import {
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
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { useFindArticleQuery } from "../../hooks/articles/use-articles";
import { cn } from "../../lib/utils";
import { EditArticlePage } from "../edit-article/EditArticlePage";
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
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("main");
  const [activeVersion, setActiveVersion] = useState(0);
  const { data: article, isLoading, isError, error } = useFindArticleQuery(id);

  const onEditCancel = () => {
    setActiveTab("main");
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

  const sortedDescriptions = [...article.responseVariants].sort(
    (a, b) => a.version - b.version
  );

  const currentDescription = sortedDescriptions[activeVersion];

  return (
    <div className="mx-auto">
      <div className="bg-background z-10 p-4 border-b flex flex-col gap-3">
        {/* Tytuł na pełną szerokość */}
        <h1 className="text-2xl font-bold text-foreground truncate">
          {article.title}
        </h1>

        {/* Rząd poniżej: po lewej status, po prawej przyciski */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          {/* Status weryfikacji */}
          <div className="flex items-center gap-1.5">
            {article.isVerified ? (
              <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center whitespace-nowrap">
                <CheckCircleIcon className="w-4 h-4 mr-1" /> Zweryfikowany
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center whitespace-nowrap">
                <XCircleIcon className="w-4 h-4 mr-1" /> Oczekuje na weryfikację
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="flex items-center whitespace-nowrap"
            >
              <EyeIcon className="w-4 h-4 mr-1" /> {article.viewsCounter}{" "}
              wyświetleń
            </Badge>
          </div>
          {/* Kontener na przyciski — tutaj może być ich wiele */}
          {activeTab === "edit" && (
            <div className="flex gap-2 flex-wrap justify-end flex-grow max-w-full">
              <Button
                onClick={() => setActiveTab("main")}
                size="sm"
                variant="destructive"
              >
                Anuluj
              </Button>
              {/* Tutaj możesz dodawać kolejne przyciski */}
            </div>
          )}{" "}
          {activeTab !== "edit" && (
            <TooltipProvider>
              <div className="flex gap-2 items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setActiveTab("edit")}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Dodaj do ulubionych</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setActiveTab("edit")}
                    >
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

        {/* Meta info (produkt, kategoria, wyświetlenia, tagi) pod tym */}
        <div className="flex justify-between mt-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="whitespace-nowrap">
              Produkt: {article.product.name}
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap">
              Kategoria: {article.category.name}
            </Badge>
            {article.tags.map((tag) => (
              <Badge
                key={tag._id}
                variant="ghost"
                className="whitespace-nowrap"
              >
                # {tag.name}
              </Badge>
            ))}
          </div>

          {activeTab !== "edit" ? (
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
          ) : (
            <div className="h-10" />
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {activeTab === "edit" ? <div className="h-5"></div> : <div></div>}
        {activeTab !== "edit" ? (
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
                  {desc.variantName?.trim()
                    ? desc.variantName
                    : `Wersja ${desc.version}`}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="h-10" />
        )}
        <TabsContent value="main">
          <Card className="mt-6">
            <CardContent className="space-y-6 p-6">
              <section>
                <h3 className="text-lg font-semibold mb-1">Opis pracownika</h3>
                <p className="text-base text-foreground">
                  {article.employeeDescription}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-1">Opis klienta</h3>
                <p className="whitespace-pre-wrap text-foreground">
                  {currentDescription?.variantContent}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-1">Twórca artykułu</h3>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon className="w-5 h-5" /> {article.createdBy.name}{" "}
                  {article.createdBy.surname}
                </p>
              </section>

              {article.verifiedBy && (
                <section>
                  <h3 className="text-lg font-semibold mb-1">
                    Zweryfikowany przez
                  </h3>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserIcon className="w-5 h-5" /> {article.verifiedBy.name}{" "}
                    {article.verifiedBy.surname}
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
                  <p className="text-sm font-medium mt-2 line-clamp-2">
                    {file.name}
                  </p>
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
          <Card className="mt-6">
            <CardContent className="divide-y p-6">
              {[].map((item) => (
                <div key={item._id} className="py-4 first:pt-0 last:pb-0">
                  <p className="text-sm text-muted-foreground">
                    <UserIcon className="w-4 h-4 inline mr-1" />{" "}
                    {item.modifiedBy.name} {item.modifiedBy.surname}
                  </p>
                  <p className="text-sm text-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <EditArticlePage
            articleId={article._id}
            onEditCancel={onEditCancel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
