import { Ellipsis, FileIcon, Hash, Lock, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Dropdown } from "../../../../components/Dropdown";
import { Button } from "../../../../components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../../components/ui/tooltip";
import type { Tag } from "./TagsList";

interface TagCardProps {
  tag: Tag;
  onEditTag: (tagId: string) => void;
}

const TagCard = ({ tag, onEditTag }: TagCardProps) => {
  return (
    <li className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition group">
      <div className="flex items-center gap-3">
        <Hash className="w-5 h-5 text-muted-foreground" />

        <span className="text-sm font-medium text-foreground">{tag.name}</span>
      </div>

      <div className="flex gap-40 items-center">
        {tag.isUsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Lock className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Tag jest używany i nie można go usunąć
            </TooltipContent>
          </Tooltip>
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
              label: "Edytuj",
              icon: <FileIcon className="w-4 h-4" />,
              actionHandler: () => onEditTag(tag._id),
            },
            {
              label: "Usuń",
              icon: <XCircleIcon className="w-4 h-4 text-red-500" />,
              actionHandler: () => toast.error(`Usuń ${tag.name}`),
            },
          ]}
          position={{ align: "end" }}
        />
      </div>
    </li>
  );
};

export default TagCard;
