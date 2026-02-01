import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { IFunnyMessage } from "../../../types/funny-message";

interface IFunnyMessageCardProps {
  msg: IFunnyMessage;
  onEdit?: (msgId: string) => void;
  onDelete?: (msg: IFunnyMessage) => void;
  currentUserId?: string;
  canEdit?: boolean;
}

const FunnyMessageCard = ({ msg, onEdit, onDelete, currentUserId, canEdit }: IFunnyMessageCardProps) => {
  return (
    <article
      aria-label={`Wiadomość: ${msg.title}`}
      className="
        group
        rounded-xl
        bg-gradient-to-br
        from-card/80
        to-card/40
        backdrop-blur-sm
        border
        shadow-sm
        hover:shadow-md
        transition-all
      "
    >
      <header className="flex items-start justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-base font-semibold text-foreground leading-snug">{msg.title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <time dateTime={msg.createdAt} className="text-xs text-muted-foreground whitespace-nowrap">
            {new Date(msg.createdAt).toLocaleDateString()}
          </time>

          {msg.createdBy._id === currentUserId || canEdit ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onEdit?.(msg._id)}>
                  <Pencil className="w-3 h-3 mr-2" /> Edytuj
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onDelete?.(msg)}>
                  <Trash2 className="w-3 h-3 mr-2" /> Usuń
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="w-3 h-3 mr-3.5" />
          )}
        </div>
      </header>

      {/* Content */}
      <div className="px-6 pb-6 pt-1 space-y-4">
        {/* Single message */}
        {msg.type === "single" && msg.entries[0] && (
          <div className="rounded-xl bg-muted/50 px-4 py-3 shadow-sm hover:shadow-md transition-all">
            <span className="text-xs font-medium text-primary">Pracownik</span>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{msg.entries[0].content}</p>
          </div>
        )}

        {/* Dialog */}
        {msg.type === "dialog" && (
          <div className="space-y-3">
            {msg.entries.map((entry, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-xl bg-muted/50 px-4 py-3 text-foreground shadow-sm hover:shadow-md transition-all"
              >
                <span className="text-xs font-medium text-primary">
                  {entry.author.toLowerCase() === "pracownik" ? "Pracownik" : "Klient"}
                </span>
                <p className="mt-1 text-sm leading-relaxed text-foreground">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default FunnyMessageCard;
