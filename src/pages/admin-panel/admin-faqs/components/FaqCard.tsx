import { BookOpen, Ellipsis, Eye, FlagTriangleRight, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";
import type { Faq } from "./FaqsList";

interface FaqCardProps {
  faq: Faq;
  navigate: (url: string) => void;
  onSetFaqAsDefault: (faqId: string) => void;
}

const FaqCard = ({ faq, navigate, onSetFaqAsDefault }: FaqCardProps) => {
  return (
    <li key={faq._id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition group">
      <div className="flex items-center gap-3">
        <BookOpen className="w-5 h-5 text-muted-foreground" />

        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{faq.title}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">Liczba pytań: {faq.items ?? 0}</span>
        </div>
      </div>
      <div className="flex items-center gap-20">
        {faq.isDefault && (
          <div className="flex items-center gap-1">
            <FlagTriangleRight className="w-4 h-4 text-primary" />
          </div>
        )}

        <Dropdown
          withSeparators
          triggerBtn={
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition">
              <Ellipsis className="w-4 h-4" />
            </Button>
          }
          options={[
            {
              label: "Wyświetl szczególy",
              icon: <Eye className="w-4 h-4" />,
              actionHandler: () => navigate(`/admin/manage-faqs/${faq._id}`),
            },

            {
              label: "Usuń",
              icon: <XCircleIcon className="w-4 h-4 text-red-500" />,
              actionHandler: () => toast.error(`Usuń ${faq.title}`),
            },
            ...(faq.isDefault
              ? []
              : [
                  {
                    label: "Ustaw jako domyślne",
                    icon: <FlagTriangleRight className="w-4 h-4 text-yellow-500" />,
                    actionHandler: () => onSetFaqAsDefault(faq._id),
                  },
                ]),
          ]}
          position={{ align: "end" }}
        />
      </div>
    </li>
  );
};

export default FaqCard;
