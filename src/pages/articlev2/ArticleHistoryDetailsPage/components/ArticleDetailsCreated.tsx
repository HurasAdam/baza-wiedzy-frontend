// ArticleHistoryCreated.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "../../../../utils/format-date";

interface Props {
  snapshot: any;
}

export const ArticeDetailsCreated = ({ snapshot }: Props) => {
  const statusLabels: Record<string, string> = {
    approved: "Zatwierdzony",
    pending: "Wymaga weryfikacji",
    rejected: "Wymagający poprawy",
    draft: "Szkic roboczy",
  };

  return (
    <div className="space-y-6 ">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{snapshot.title}</CardTitle>
            <Badge variant={snapshot.status === "draft" ? "secondary" : "default"}>
              {statusLabels[snapshot.status] || snapshot.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                {snapshot.createdBy?.name?.[0]}
                {snapshot.createdBy?.surname?.[0]}
              </AvatarFallback>
            </Avatar>
            <span>
              {snapshot.createdBy?.name} {snapshot.createdBy?.surname}
            </span>
            <span>·</span>
            <span>{formatDate(snapshot.createdAt)}</span>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informacje podstawowe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Produkt:</span> {snapshot.product?.name}
            </div>
            <div>
              <span className="font-medium">Kategoria:</span> {snapshot.category?.name}
            </div>
            <div>
              <span className="font-medium">Tagi:</span>{" "}
              {snapshot.tags?.map((t: any) => (
                <Badge key={t._id} className="mr-1">
                  {t.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{snapshot.employeeDescription || "Brak opisu"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Warianty odpowiedzi</CardTitle>
        </CardHeader>
        <CardContent>
          {snapshot.responseVariants && snapshot.responseVariants.length > 0 ? (
            <Tabs defaultValue={snapshot.responseVariants[0].id} className="w-full">
              <TabsList className="flex flex-wrap justify-start mb-4">
                {snapshot.responseVariants.map((variant: any) => (
                  <TabsTrigger key={variant.id} value={variant.id} className="text-sm">
                    {variant.variantName}
                  </TabsTrigger>
                ))}
              </TabsList>

              {snapshot.responseVariants.map((variant: any) => (
                <TabsContent key={variant.id} value={variant.id}>
                  <div className="border rounded-xl p-4 shadow-sm bg-muted/30">
                    <h4 className="font-semibold mb-2">{variant.variantName}</h4>
                    <Separator className="my-2" />
                    <p className="text-sm whitespace-pre-line">{variant.variantContent}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <p className="text-sm text-muted-foreground">Brak wariantów</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadane</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Zweryfikowany:</span> {snapshot.isVerified ? "Tak" : "Nie"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
