import {
  CheckCircleIcon,
  DownloadIcon,
  EyeIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useFindArticleQuery } from "../../hooks/articles/use-articles";

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
  const { data: article, isLoading, isError, error } = useFindArticleQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground animate-pulse">
          Ładowanie artykułu...
        </p>
      </div>
    );
  }

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

  return (
    <div className="mx-auto ">
      <Card className="shadow-lg min-h-[calc(100vh)]">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold">
              {article.title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-2.5">
              <span
                className={`font-medium ${
                  article.isVerified ? "text-emerald-600" : "text-foreground"
                } `}
              >
                {article.isVerified ? (
                  <span className="flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    Zweryfikowany
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <XCircleIcon className="w-4 h-4" />
                    Oczekuje na weryfikację
                  </span>
                )}
              </span>
            </CardDescription>
          </div>
        </CardHeader>
        <Tabs defaultValue="main" className="w-full ">
          <section className="flex px-5 mb-10 flex-wrap sm:flex-nowrap justify-start sm:justify-between items-start gap-2 flex-col sm:flex-row">
            {/* Lewa strona: badge */}
            <div className="flex flex-wrap gap-2">
              <Badge
                style={{ backgroundColor: article.product.labelColor }}
                className="text-white"
              >
                Produkt: {article.product.name}
              </Badge>

              <Badge className="bg-muted text-foreground">
                Kategoria: {article.category.name}
              </Badge>

              <Badge className="bg-secondary text-white flex items-center">
                Wyświetleń: {article.viewsCounter}
                <EyeIcon className="w-4 h-4 ml-1" />
              </Badge>
            </div>

            {/* Prawa strona: tagi */}
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {article.tags.map((tag) => (
                <Badge
                  key={tag._id}
                  className="bg-accent text-muted-foreground"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </section>

          <TabsList className="mb-0.5  bg-transparent">
            <div className="mx-4 bg-muted p-1.5 rounded-lg">
              <TabsTrigger value="main">Dane główne</TabsTrigger>

              <TabsTrigger value="attachments">Załączniki</TabsTrigger>
              <TabsTrigger value="history">Historia zmian</TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="main" className="space-y-6">
            <CardContent className="space-y-6">
              {/* BADGE + TAGI  */}

              <Separator />

              <section>
                <h3 className="text-lg font-medium mb-2">Opis pracownika</h3>
                <p className="text-base text-foreground">
                  {article.employeeDescription}
                </p>
              </section>

              <Separator />

              <section>
                <h3 className="text-lg font-medium mb-2">Opis klienta</h3>
                <p className="text-base text-foreground break-words whitespace-pre-wrap">
                  {article.clientDescription}
                </p>
              </section>

              <Separator />

              <section>
                <h3 className="text-lg font-medium mb-2">Twórca artykułu</h3>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon className="w-5 h-5" />
                  {article.createdBy.name} {article.createdBy.surname}
                </p>
              </section>

              {article.verifiedBy && (
                <section>
                  <h3 className="text-lg font-medium mb-2">
                    Zweryfikowany przez
                  </h3>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserIcon className="w-5 h-5" />
                    {article.verifiedBy.name} {article.verifiedBy.surname}{" "}
                    {article.verifiedBy.isActive ? (
                      <Badge className="bg-green-500 text-white ml-2">
                        Aktywny
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500 text-white ml-2">
                        Nieaktywny
                      </Badge>
                    )}
                  </p>
                </section>
              )}

              <Separator />

              <section className="flex justify-between text-xs text-muted-foreground">
                <div>
                  <strong>Utworzono:</strong>{" "}
                  <time dateTime={article.createdAt}>
                    {new Date(article.createdAt).toLocaleString("pl-PL")}
                  </time>
                </div>
                <div>
                  <strong>Ostatnia aktualizacja:</strong>{" "}
                  <time dateTime={article.updatedAt}>
                    {new Date(article.updatedAt).toLocaleString("pl-PL")}
                  </time>
                </div>
              </section>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  Edytuj
                </Button>
                <Button variant="default" size="sm">
                  Usuń
                </Button>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="history">
            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-sm">
                (Przykładowa treść) Historia zmian będzie tutaj. Możesz tu dodać
                np. listę edycji, zmiany statusu itd.
              </p>
            </CardContent>
          </TabsContent>

          <TabsContent value="attachments">
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Załączniki</h3>

              {[
                {
                  name: "instrukcja-obslugi.pdf",
                  type: "PDF",
                  size: "1.2 MB",
                  createdAt: "2025-07-01T12:34:00",
                  url: "#",
                },
                {
                  name: "zdjecie-maszyny.jpg",
                  type: "Obraz",
                  size: "2.5 MB",
                  createdAt: "2025-07-02T09:10:00",
                  url: "#",
                },
                {
                  name: "protokol-serwisowy.docx",
                  type: "Dokument Word",
                  size: "900 KB",
                  createdAt: "2025-07-04T16:15:00",
                  url: "#",
                },
              ].map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Ikona pliku */}
                  <div className="flex-shrink-0">{getFileIcon(file.type)}</div>

                  {/* Informacje o pliku */}
                  <div className="flex flex-col flex-grow">
                    <span className="text-lg font-semibold text-foreground ">
                      {file.name}
                    </span>
                    <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-4">
                      <span>Typ: {file.type}</span>
                      <span>Rozmiar: {file.size}</span>
                      <span>
                        Dodano:{" "}
                        {new Date(file.createdAt).toLocaleString("pl-PL")}
                      </span>
                    </div>
                  </div>

                  {/* Akcje */}
                  <div className="flex flex-col gap-2 ml-auto">
                    <Button variant="outline" size="sm" asChild>
                      <a href={file.url} download>
                        <DownloadIcon className="w-4 h-4 mr-1 inline" />
                        Pobierz
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
