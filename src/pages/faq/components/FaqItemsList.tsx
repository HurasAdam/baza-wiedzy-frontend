// FaqItemsContent.tsx
import { Edit, Loader, MoreHorizontal, Pin, Trash } from "lucide-react";
import { Dropdown } from "../../../components/Dropdown";
import { Button } from "../../../components/ui/button";
import { CardContent } from "../../../components/ui/card";
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
      <CardContent className="mx-auto">
        <Loader className="animate-spin" />
      </CardContent>
    );
  }

  return (
    <CardContent>
      <ul className="divide-y divide-border">
        {items?.map((item) => (
          <li key={item._id} className="flex justify-between items-start py-3">
            <div className="flex flex-col gap-1.5 py-2.5">
              <p className="text-base leading-[1.4644] font-medium flex items-center gap-2">
                <Pin className="w-6 h-6 bg-accent/80 rounded-sm p-1 text-primary-foreground" /> {item.question}
              </p>
              <p className="text-[15px] leading-[1.4644] text-foreground px-8 py-3">{item.answer}</p>
            </div>

            {canEdit ? (
              <Dropdown
                triggerBtn={
                  <Button size="icon" variant="ghost" aria-label="Opcje pytania" className="p-1 rounded">
                    <MoreHorizontal className="w-5 h-5 hover:text-primary" />
                  </Button>
                }
                options={[
                  { label: "Edytuj", icon: <Edit className="w-4 h-4" />, actionHandler: () => onEdit(item._id) },
                  {
                    label: "Usuń",
                    icon: <Trash className="w-4 h-4 text-rose-600/80" />,
                    actionHandler: () => onDelete(item),
                  },
                ]}
                position={{ align: "end" }}
              />
            ) : (
              <Button disabled size="icon" variant="ghost" aria-label="Opcje pytania" className="p-1 rounded">
                <MoreHorizontal className="w-5 h-5 hover:text-primary" />
              </Button>
            )}
          </li>
        ))}
      </ul>
    </CardContent>
  );
};

export default FaqItemsList;
