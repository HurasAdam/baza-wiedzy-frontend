import {
  Ellipsis,
  FileIcon,
  Hash,
  Loader,
  Lock,
  Plus,
  XCircleIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/Dropdown";
import { useFindTagsQuery } from "@/hooks/tags/use-tags";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const dropdownOptions = [
  {
    label: "Dodaj tag",
    icon: <Plus className="w-4 h-4" />,
    actionHandler: () => toast.info("Dodaj tag (TODO: modal)"),
  },
];

const triggerBtn = (
  <Button variant="default" className="flex items-center gap-1">
    Dodaj <Plus className="w-4 h-4" />
  </Button>
);

export const TagsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append("name", searchTerm);
    return searchParams;
  }, [searchTerm]);

  const {
    data: tags = [],
    isLoading,
    isError,
    error,
  } = useFindTagsQuery(params);

  return (
    <div className="mx-auto pb-6">
      {/* Header */}
      <div className="bg-background z-10 flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Hash className="w-6 h-6 text-muted-foreground" /> Tagi
          </h1>
          <Dropdown
            triggerBtn={triggerBtn}
            options={dropdownOptions}
            position={{ align: "end" }}
          />
        </div>

        {/* Filters */}
        <div className="flex bg-muted/40 rounded-lg px-3 py-2 gap-3 items-center flex-wrap">
          <Input
            placeholder="Wyszukaj tag..."
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
            Resetuj
          </Button>
          <Badge variant="outline" className="ml-auto">
            Znaleziono: {tags.tags && tags.tags.length}
          </Badge>
        </div>
      </div>

      {/* Tags List */}
      <div className="bg-card border rounded-xl overflow-hidden">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin w-6 h-6" />
          </div>
        )}

        {isError && (
          <p className="text-destructive text-center py-10">
            {(error as Error)?.message || "Błąd podczas ładowania produktów"}
          </p>
        )}

        {!isLoading && !isError && tags.tags.length === 0 && (
          <p className="text-center py-10">Nie znaleziono produktów</p>
        )}

        {!isLoading && !isError && tags.tags.length > 0 && (
          <ul className="divide-y divide-border">
            {tags.tags.map((tag) => (
              <li
                key={tag._id}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition group"
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-muted-foreground" />

                  <span className="text-sm font-medium text-foreground">
                    {tag.name}
                  </span>
                </div>

                {/* Actions */}
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition"
                      >
                        <Ellipsis className="w-4 h-4" />
                      </Button>
                    }
                    options={[
                      {
                        label: "Edytuj",
                        icon: <FileIcon className="w-4 h-4" />,
                        actionHandler: () => toast.info(`Edytuj ${tag.name}`),
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
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
