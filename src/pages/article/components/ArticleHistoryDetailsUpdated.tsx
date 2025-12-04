import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChangeItem {
  field: string;
  oldValue: any;
  newValue: any;
  _id: string;
}

interface ArticleHistoryUpdatedProps {
  changes: ChangeItem[];
}

const statusLabels: Record<string, string> = {
  approved: "Zatwierdzony",
  pending: "Wymaga weryfikacji",
  rejected: "Wymagający poprawy",
  draft: "Szkic roboczy",
};

export const ArticleHistoryDetailsUpdated = ({ changes }: ArticleHistoryUpdatedProps) => {
  if (!changes || changes.length === 0) return <div>Brak zmian</div>;

  const fieldNameTranslationMap: Record<string, string> = {
    title: "Tytuł",
    tags: "Tagi",
    product: "Produkt",
    category: "Kategoria",
    employeeDescription: "Uwagi dla pracownika",
  };

  const renderValue = (change: ChangeItem, value: any) => {
    if (!value) return "Brak";

    if (change.field === "tags" && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((t: any) => (
            <Badge key={t.id || t._id}>{t.name}</Badge>
          ))}
        </div>
      );
    }

    if ((change.field === "product" || change.field === "category") && value.name) {
      return value.name;
    }

    // Mapowanie statusów
    if (change.field === "statusChange" || change.field === "status") {
      return statusLabels[value] || value;
    }

    return value.toString();
  };

  return (
    <div className="space-y-6">
      {changes.map((change) => {
        if (change.field === "responseVariants") {
          return (
            <Card key={change._id}>
              <CardHeader>
                <CardTitle>Warianty odpowiedzi dla klienta</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={change.newValue[0]._id} className="w-full">
                  <TabsList className="flex flex-wrap justify-start mb-4">
                    {change.newValue.map((variant: any) => (
                      <TabsTrigger key={variant._id} value={variant._id} className="text-sm">
                        {variant.variantName}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {change.newValue.map((variant: any) => {
                    const oldVariant = change.oldValue?.find((v: any) => v.version === variant.version);
                    return (
                      <TabsContent key={variant._id} value={variant._id}>
                        <div className="border rounded-xl p-4 shadow-sm bg-muted/30">
                          <h4 className="font-semibold mb-2">{variant.variantName}</h4>
                          <Separator className="my-2" />
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Poprzednia wersja:</strong>
                              <p className="whitespace-pre-wrap break-words">{oldVariant?.variantContent || "Brak"}</p>
                            </div>
                            <div>
                              <strong>Nowa wersja:</strong>
                              <p className="whitespace-pre-wrap break-words">{variant.variantContent}</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          );
        }

        return (
          <Card key={change._id}>
            <CardHeader>
              <CardTitle>{fieldNameTranslationMap[change.field] || change.field}</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Poprzednia wartość:</strong>
                <div>{renderValue(change, change.oldValue)}</div>
              </div>
              <div>
                <strong>Nowa wartość:</strong>
                <div>{renderValue(change, change.newValue)}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
