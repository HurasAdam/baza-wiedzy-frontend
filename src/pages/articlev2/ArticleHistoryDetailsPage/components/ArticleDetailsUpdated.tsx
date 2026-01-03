import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { diffWords } from "diff";

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

export const ArticleDetailsUpdated = ({ changes }: ArticleHistoryUpdatedProps) => {
  if (!changes || changes.length === 0) return <div>Brak zmian</div>;

  const fieldNameTranslationMap: Record<string, string> = {
    title: "Tytuł",
    tags: "Tagi",
    product: "Produkt",
    category: "Kategoria",
    employeeDescription: "Uwagi dla pracownika",
  };

  const renderDiff = (oldStr: string = "", newStr: string = "") => {
    const diffs = diffWords(oldStr, newStr);
    return diffs.map((part, index) => {
      if (part.added) {
        return (
          <span key={index} className="bg-green-800/75 text-foreground font-base px-1 rounded">
            {part.value}
          </span>
        );
      } else if (part.removed) {
        return (
          <span key={index} className="bg-red-800/75 text-foreground px-1 rounded line-through">
            {part.value}
          </span>
        );
      } else {
        return <span key={index}>{part.value}</span>;
      }
    });
  };
  const renderValue = (change: ChangeItem, value: any, oldValue?: any) => {
    if (!value && !oldValue) return "Brak";

    // Tagi
    if (change.field === "tags" && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((t: any) => (
            <Badge key={t.id || t._id}>{t.name}</Badge>
          ))}
        </div>
      );
    }

    if ((change.field === "product" || change.field === "category") && value?.name) {
      return value.name;
    }

    if (change.field === "statusChange" || change.field === "status") {
      return statusLabels[value] || value;
    }

    if (typeof value === "string" || typeof oldValue === "string") {
      return <>{renderDiff(oldValue || "", value || "")}</>;
    }

    return value?.toString() || "Brak";
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
                              <p className="whitespace-pre-wrap break-words">
                                {renderValue(change, variant.variantContent, oldVariant?.variantContent)}
                              </p>
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
                <div>{renderValue(change, change.oldValue, change.oldValue)}</div>
              </div>
              <div>
                <strong>Nowa wartość:</strong>
                <div>{renderValue(change, change.newValue, change.oldValue)}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
