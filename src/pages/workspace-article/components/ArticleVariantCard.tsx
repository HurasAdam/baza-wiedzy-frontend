import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, MoreHorizontal } from "lucide-react";

interface ArticleVariantCardProps {
  name: string;
  content: string;
  onCopy: (text: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  permissions: Record<string, boolean>;
}

export function ArticleVariantCard({ name, content, onCopy, onEdit, onDelete, permissions }: ArticleVariantCardProps) {
  return (
    <Card className="shadow-sm border transition bg-muted/35">
      <CardContent className="flex flex-col gap-3">
        {/* Nagłówek karty */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Dropdown po lewej */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-muted/50 transition">
                  <MoreHorizontal className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem disabled={!permissions.editArticle} onClick={onEdit}>
                  Edytuj
                </DropdownMenuItem>
                <DropdownMenuItem disabled={!permissions.editArticle} onClick={onDelete}>
                  Usuń
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Nazwa wariantu */}
            <h3 className="text-sm font-semibold text-foreground/90">{name}</h3>
          </div>

          {/* Kopiowanie po prawej */}
          {content && (
            <button
              onClick={() => onCopy(content)}
              className="p-1 rounded hover:bg-muted/50 transition"
              title="Kopiuj do schowka"
            >
              <Copy className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </button>
          )}
        </div>

        {/* Separator */}
        <div className="border-t border-muted my-0.5"></div>

        {/* Treść wariantu */}
        <p className="text-[15.5px] whitespace-pre-wrap text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  );
}
