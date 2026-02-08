import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
      <div className="grid grid-cols-1 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse h-28 rounded-2xl bg-card/50 shadow-inner" />
        ))}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-5.5 mt-1">
      {items?.map((item) => (
        <AccordionItem
          key={item._id}
          value={item._id}
          className="group relative  bg-background backdrop-blur-sm transition-all duration-300
                     group-data-[state=open]:bg-muted/30 group-data-[state=open]:shadow-md"
        >
          <AccordionTrigger className="flex items-center justify-between px-6 py-4 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 backdrop-blur-sm shadow-sm transition-all duration-200 group-data-[state=open]:bg-primary/50">
                <Pin className="w-3.5 h-3.5 text-primary/80 group-data-[state=open]:text-foreground" />
              </div>

              <h2 className="text-sm font-medium text-foreground leading-snug">{item.question}</h2>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-6 pb-6 pt-2 ">
            <div className="relative rounded-lg bg-muted/30 border border-border/20 px-5 py-5   transition-all duration-300">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Odpowiedź</span>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.answer}</p>

              {canEdit && (
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-card/40 transition-colors duration-200">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card/90 shadow-lg border border-border/30">
                      <DropdownMenuItem onSelect={() => onEdit(item._id)}>
                        <Edit className="w-3 h-3 mr-2" /> Edytuj
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onDelete(item)}>
                        <Trash className="w-3 h-3 mr-2 text-rose-600/80" /> Usuń
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FaqItemsList;
