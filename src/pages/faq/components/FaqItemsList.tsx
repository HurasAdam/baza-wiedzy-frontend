import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
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
      <div className="space-y-3 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-4 mt-6">
      {items?.map((item) => (
        <AccordionItem
          key={item._id}
          value={item._id}
          className="group rounded-2xl border border-border/60 bg-background transition-all duration-200 data-[state=open]:shadow-sm data-[state=open]:border-primary/30 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm
                         shadow-sm"
        >
          {/* Pytanie */}
          <AccordionTrigger className="px-6 py-5 hover:no-underline ">
            <div className="flex items-center justify-between w-full">
              <div className="text-base font-medium tracking-tight">{item.question}</div>
            </div>
          </AccordionTrigger>

          {/* Odpowiedź */}
          <AccordionContent className="px-6 pb-6">
            <div className="rounded-xl bg-background border border-border/40 pr-5 py-5 text-sm leading-relaxed text-muted-foreground">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 mb-1.5">
                  <div className="min-w-0.5 max-w-0.5 min-h-[40px] rounded-full bg-primary/60 mt-1 self-stretch" />
                  <div>{item.answer}</div>
                </div>

                {canEdit && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onEdit(item._id)}>
                        <Edit className="w-3 h-3 mr-2" />
                        Edytuj
                      </DropdownMenuItem>

                      <DropdownMenuItem onSelect={() => onDelete(item)}>
                        <Trash className="w-3 h-3 mr-2 text-rose-600" />
                        Usuń
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FaqItemsList;
