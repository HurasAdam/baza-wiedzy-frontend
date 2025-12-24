// FaqItemsList.tsx
import { Edit, MoreHorizontal, Pin, Trash } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
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
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse h-44 bg-muted/50 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {items?.map((item) => (
        <article
          key={item._id}
          className="group rounded-xl bg-gradient-to-br from-card/90 to-card/70 border border-border backdrop-blur-sm shadow-sm hover:shadow-lg transition-all"
        >
          {/* Nagłowek pytania */}
          <header className="flex justify-between items-start px-6 py-4 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Pin className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold text-foreground leading-snug">{item.question}</h2>
            </div>

            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => onEdit(item._id)}>
                    <Edit className="w-3 h-3 mr-2" /> Edytuj
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onDelete(item)}>
                    <Trash className="w-3 h-3 mr-2 text-rose-600/80" /> Usuń
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </header>

          {/* Odpowiedź */}
          <div className="px-6 pb-6">
            <div className="rounded-xl bg-muted/50 px-5 py-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-xs font-medium text-primary uppercase tracking-wide">Odpowiedź</span>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{item.answer}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default FaqItemsList;
