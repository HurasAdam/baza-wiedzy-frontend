import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import React from "react";

type FunnyMessagesFilterBarProps = {
  selectedTitle: string;
  selectedAuthor: string;
  authors?: { _id: string; name: string; surname: string }[];
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAuthorChange: (id: string) => void;
  onResetAll: () => void;
  resultsCount?: number;
};

const FunnyMessagesFilterBar: React.FC<FunnyMessagesFilterBarProps> = ({
  selectedTitle,
  selectedAuthor,
  authors = [],
  onTitleChange,
  onAuthorChange,
  onResetAll,
  resultsCount,
}) => {
  const hasFilters = selectedTitle || selectedAuthor;

  // Wyciągamy autora raz
  const selectedAuthorObj = authors.find((a) => a._id === selectedAuthor);
  const authorDisplayName = selectedAuthorObj ? `${selectedAuthorObj.name} ${selectedAuthorObj.surname[0]}.` : null;

  return (
    <div className="bg-background flex flex-col mb-4">
      {/* Active Filter Badges */}
      <div className="flex gap-2 pt-2.5 flex-wrap px-2 h-6 mb-3">
        {selectedTitle && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 w-full min-w-[150px] max-w-[150px] justify-between"
          >
            <span className="text-xs font-semibold">🔍</span>
            <span className="truncate" title={selectedTitle}>
              {selectedTitle}
            </span>
            <button
              onClick={() => onTitleChange({ target: { value: "" } } as any)}
              className="hover:text-destructive"
              aria-label="Usuń filtr tytułu"
            >
              <X className="w-4 h-4" />
            </button>
          </Badge>
        )}

        {authorDisplayName && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 w-full min-w-[130px] max-w-[130px] justify-between"
          >
            👤 {authorDisplayName}
            <button
              onClick={() => onAuthorChange("")}
              className="hover:text-destructive"
              aria-label="Usuń filtr autora"
            >
              <X className="w-4 h-4" />
            </button>
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="flex px-3 py-2 gap-3 items-center flex-wrap">
        {/* Title Input */}
        <Input
          value={selectedTitle}
          onChange={onTitleChange}
          placeholder="Szukaj po tytule..."
          className="w-52 border-ring"
        />

        {/* Author Select */}
        <Select onValueChange={(value) => onAuthorChange(value === "all" ? "" : value)} value={selectedAuthor || "all"}>
          <SelectTrigger className="w-52 border-ring">
            <SelectValue placeholder="Wybierz autora" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Wszyscy</SelectItem>
              {authors.map(({ _id, name, surname }) => (
                <SelectItem key={_id} value={_id}>
                  {name} {surname}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Reset */}
        <Button variant="outline" size="sm" disabled={!hasFilters} onClick={onResetAll} className="ml-auto">
          Wyczyść filtry
        </Button>

        {/* Results Count */}
        {typeof resultsCount === "number" && (
          <Badge variant="outline" className="ml-2">
            Znaleziono: {resultsCount}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default FunnyMessagesFilterBar;
