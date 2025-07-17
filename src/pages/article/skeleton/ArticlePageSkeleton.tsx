import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";

export const ArticlePageSkeleton = () => {
  return (
    <div className="relative mx-auto">
      {/* Spinner jako overlay na środku */}
      <div className="absolute inset-0 flex justify-center items-center z-10">
        <Loader className="w-8 h-8 text-muted-foreground animate-spin" />
      </div>

      {/* Skeleton z częściową przezroczystością i brakiem interakcji */}
      <Card className="shadow-lg min-h-[calc(100vh)] animate-pulse opacity-60 pointer-events-none">
        <Tabs value="main" className="w-full">
          <>
            <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <CardTitle className="text-2xl font-semibold">
                  <Skeleton className="h-6 w-60" />
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-2.5">
                  <Skeleton className="h-4 w-48" />
                </CardDescription>
              </div>
            </CardHeader>

            <section className="flex px-5 mb-10 flex-wrap sm:flex-nowrap justify-start sm:justify-between items-start gap-2 flex-col sm:flex-row">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-36 rounded-full" />
                <Skeleton className="h-6 w-40 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            </section>

            <TabsList className="mb-0.5 bg-transparent">
              <div className="mx-4 bg-muted p-1.5 rounded-lg">
                <TabsTrigger value="main">Dane główne</TabsTrigger>
                <TabsTrigger value="attachments">Załączniki</TabsTrigger>
                <TabsTrigger value="history">Historia zmian</TabsTrigger>
              </div>
            </TabsList>
          </>

          <TabsContent value="main">
            <CardContent className="space-y-6">
              <Separator />

              <section>
                <h3 className="text-lg font-medium mb-2">Opis pracownika</h3>
                <Skeleton className="h-20 w-full rounded-md" />
              </section>

              <Separator />

              <section>
                <h3 className="text-lg font-medium mb-2">Opis klienta</h3>
                <Skeleton className="h-28 w-full rounded-md" />
              </section>

              <Separator />

              <section>
                <h3 className="text-lg font-medium mb-2">Twórca artykułu</h3>
                <Skeleton className="h-4 w-52" />
              </section>

              <section>
                <h3 className="text-lg font-medium mb-2">
                  Zweryfikowany przez
                </h3>
                <Skeleton className="h-4 w-60" />
              </section>

              <Separator />

              <section className="flex justify-between text-xs text-muted-foreground">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-52" />
              </section>

              <div className="flex justify-end space-x-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
