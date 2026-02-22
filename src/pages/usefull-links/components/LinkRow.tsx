import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";

interface CompanyLink {
  _id: string;
  name: string;
  url: string;
  description?: string;
  linkCategory?: { _id: string; name: string };
  isFeatured?: boolean;
  updatedAt?: string;
}

interface Props {
  link: CompanyLink;
  onDelete: (linkId: string) => void;
}

export const LinkRow = ({ link, onDelete }: Props) => {
  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url).then(() => {
      toast.info("", {
        position: "bottom-right",
        description: "Link do zasobu został skopiowany do schowka",
      });
      console.log("Skopiowano link:", link.url);
    });
  };

  const openLink = (url: string) => {
    const normalizedUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    window.open(normalizedUrl, "_blank");
  };

  return (
    <div
      onClick={() => openLink(link.url)}
      className="group flex items-center justify-between p-3 rounded-lg border border-border/95 hover:bg-muted/40 transition-all cursor-pointer  backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          onClick={copyToClipboard}
          className="flex items-center justify-center w-8 h-8 bg-muted rounded-full cursor-pointer hover:bg-primary/20 transition-colors"
        >
          <Copy className="w-4 h-4 text-primary" />
        </div>

        <div className="min-w-0">
          <div className="font-medium truncate">{link.name}</div>

          <div className="text-xs text-muted-foreground truncate">{link.url.replace(/^https?:\/\//, "")}</div>

          {link.description && (
            <div className="text-xs text-muted-foreground/80 mt-1 line-clamp-2">{link.description}</div>
          )}
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-not-allowed opacity-50">
                  <Pencil className="w-3 h-3 mr-2" />
                  Edytuj
                </DropdownMenuItem>
              </TooltipTrigger>

              <TooltipContent side="left">✨ Funkcja edycji w przygotowaniu</TooltipContent>
            </Tooltip>

            <DropdownMenuItem onClick={() => onDelete(link._id)}>
              <Trash2 className="w-3 h-3 mr-2" />
              Usuń
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
