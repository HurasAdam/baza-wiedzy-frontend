// FaqItemsList.tsx
import { Edit, MoreHorizontal, Pin, Trash } from "lucide-react";
import { Dropdown } from "../../../components/Dropdown";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import type { FaqItem } from "../../../types/faq";

interface FaqItemsListProps {
  isFaqLoading: boolean;
  items: FaqItem[] | undefined;
  canEdit: boolean;
  onEdit: (id: string) => void;
  onDelete: (item: FaqItem) => void;
}

const FaqItemsList = ({ isFaqLoading, items, canEdit, onEdit, onDelete }: FaqItemsListProps) => {
  if (isFaqLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse h-60 bg-muted/50 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
      {items?.map((item) => (
        <Card key={item._id} className="bg-card/70 rounded-xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="flex flex-col gap-3">
            {/* Pytanie */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Pin className="w-5 h-5 text-primary-foreground" />
                <h3 className="font-semibold text-foreground">{item.question}</h3>
              </div>

              {canEdit && (
                <Dropdown
                  triggerBtn={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Opcje pytania"
                      className="p-1 rounded  group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  }
                  options={[
                    {
                      label: "Edytuj",
                      icon: <Edit className="w-4 h-4" />,
                      actionHandler: () => onEdit(item._id),
                    },
                    {
                      label: "Usuń",
                      icon: <Trash className="w-4 h-4 text-rose-600/80" />,
                      actionHandler: () => onDelete(item),
                    },
                  ]}
                  position={{ align: "end" }}
                />
              )}
            </div>

            {/* Odpowiedź */}
            <p className="text-sm text-foreground leading-relaxed bg-muted/10 rounded-lg p-3">{item.answer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FaqItemsList;
